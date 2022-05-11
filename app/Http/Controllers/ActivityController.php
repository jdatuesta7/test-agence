<?php

namespace App\Http\Controllers;

use App\Models\ConsultantUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ActivityController extends Controller
{
    public function index()
    {
        $consultantUsers = ConsultantUser::join("permissao_sistema", "permissao_sistema.co_usuario", "=", "cao_usuario.co_usuario")
            ->where("permissao_sistema.co_sistema", "=", "1")
            ->where("permissao_sistema.in_ativo", "=", "S")
            ->whereIn("permissao_sistema.co_tipo_usuario", [0, 1, 2])
            ->orderBy("cao_usuario.no_usuario")
            ->get();

        return view('activity', compact('consultantUsers'));
    }

    public function getConsultantUser($co_usuario)
    {
        $consultantUser = ConsultantUser::find($co_usuario);

        if (!empty($consultantUser)) {
            return response()->json(['code' => 200, 'data' => $consultantUser], 200);
        } else {
            return response()->json(['code' => 404, 'data' => 'Consultant user not found'], 404);
        }
    }

    private function getInvoices($users, $startDate, $endDate)
    {
        $allInvoices = [];
        foreach ($users as $user) {
            $allInvoices[] = DB::table("cao_fatura")
                ->where("cao_fatura.data_emissao", ">=", $startDate ? $startDate : '1753-01-01')
                ->where("cao_fatura.data_emissao", "<=", $endDate ? $endDate : date('Y-m-d'))
                ->join("cao_os", "cao_fatura.co_os", "=", "cao_os.co_os")
                ->where("cao_os.co_usuario", "=", $user)
                ->join("cao_sistema", "cao_fatura.co_sistema", "=", "cao_sistema.co_sistema")
                ->where("cao_sistema.co_usuario", "=", $user)
                ->join("cao_cliente", "cao_fatura.co_cliente", "=", "cao_cliente.co_cliente")
                ->get();
        }

        return $allInvoices;
    }

    public function generateReport(Request $request)
    {

        $idUsersSelected = $request->except(['_token', 'startDate', 'endDate']);

        if (empty($idUsersSelected)) {
            return redirect()->back()->with('error', 'Debe seleccionar uno o más usuarios');
        }

        //obtener todos los consultores seleccionados
        $consultantUser = [];
        foreach ($idUsersSelected['selected_users'] as $idUser) {
            $consultantUser[] = ConsultantUser::find($idUser);
        }

        $startDate = $request->startDate;
        $endDate = $request->endDate;

        //obtener todas las facturas del consultor
        $allInvoices = $this->getInvoices($idUsersSelected['selected_users'], $startDate, $endDate);

        if ($startDate && $endDate) {
            $startDate = date('d-m-Y', strtotime($startDate));
            $endDate = date('d-m-Y', strtotime($endDate));
        }

        //obtener datos del reporte generado
        $dataReport = [];
        foreach ($allInvoices as $invoices) {
            $warning = false;
            if (count(($invoices)) != 0) {
                $totalValue = 0;
                $totalComission = 0;
                foreach ($invoices as $invoice) {
                    $value = $invoice->valor - ($invoice->valor * $invoice->total_imp_inc / 100);
                    $totalValue += $value;
                    $totalComission += ($value * $invoice->comissao_cn / 100);
                }

                $fixedCost = DB::table("cao_salario")->where("co_usuario", "=", $invoice->co_usuario)->first();

                $dataReport[] = [
                    'profit' => ($totalValue - ($totalComission + ($fixedCost ? $fixedCost->brut_salario : 0))),
                    'comission' => $totalComission,
                    'fixedCost' => $fixedCost ? $fixedCost->brut_salario : 'N/A',
                    'netIncome' => $totalValue,
                    'user' => $consultantUser[array_search($invoice->co_usuario, $idUsersSelected['selected_users'])]
                ];
            } else {
                $warning = true;
            }
        }

        return view('report', compact('dataReport', 'warning', 'startDate', 'endDate'));
    }

    public function showGraph(Request $request)
    {
        $startDate = $request->startDate;
        $endDate = $request->endDate;
        $idUsers = $request->idUsers;

        if (!$startDate && !$endDate) {
            return response()->json(['code' => 404, 'data' => 'Fechas no encontradas'], 404);
        }

        if (!$idUsers) {
            return response()->json(['code' => 404, 'data' => 'Usuarios no encontrados'], 404);
        }

        //obtener todos los consultores seleccionados
        $consultantUser = [];
        foreach ($idUsers as $idUser) {
            $consultantUser[] = ConsultantUser::find($idUser);
        }

        $months = [];
        $startDateMonth = date('Y-m-d', strtotime($startDate));
        $endDateMonth = date('Y-m-d', strtotime($endDate));

        $startDateMonth = new \DateTime($startDateMonth);
        $endDateMonth = new \DateTime($endDateMonth);
        $interval = new \DateInterval('P1M');

        //obtener los meses del periodo seleccionado
        $period = new \DatePeriod($startDateMonth, $interval, $endDateMonth);
        foreach ($period as $date) {
            $months[] = $date->format('Y-m');
        }

        //obtener las facturas correspondientes a cada consultor
        $invoicesByUser = $this->getInvoices($idUsers, $startDate, $endDate);

        if (count($invoicesByUser[0]) == 0) {
            return response()->json(['code' => 404, 'data' => 'Facturas no encontradas'], 404);
        }

        //OBTENER TOTAL GANANCIAS NETAS POR CADA MES Y USUARIO
        $dataGraph = [];
        $totalFixedCost = 0;

        foreach ($invoicesByUser as $invoicesUser) {
            $warning = false;

            if (count(($invoicesUser)) != 0) {
                $totalValue = 0;
                $netIncomeByMonth = [];

                foreach ($months as $month) {
                    foreach ($invoicesUser as $invoice) {
                        if ($month == date('Y-m', strtotime($invoice->data_emissao))) {
                            $value = $invoice->valor - ($invoice->valor * $invoice->total_imp_inc / 100);
                            $totalValue += $value;
                        }
                    }
                    $netIncomeByMonth[] = [
                        'month' => $month,
                        'value' => $totalValue
                    ];
                }

                $dataGraph[] = [
                    'netIncome' => $netIncomeByMonth,
                    'user' => $consultantUser[array_search($invoicesUser[0]->co_usuario, $idUsers)]
                ];
            } else {
                $warning = true;
            }

            $fixedCost = DB::table("cao_salario")->where("co_usuario", "=", $invoicesUser[0]->co_usuario)->first();
            if ($fixedCost) {
                $totalFixedCost += $fixedCost->brut_salario;
            }
        }

        $avgFixedCost = $totalFixedCost / count($idUsers);

        return response()->json([
            'code' => 200,
            'users' => $consultantUser,
            'months' => $months,
            'dataGraph' => $dataGraph,
            'avgFixedCost' => $avgFixedCost,
            'warning' => $warning
        ], 200);
    }

    public function showPizza(Request $request)
    {
        $startDate = $request->startDate;
        $endDate = $request->endDate;
        $idUsers = $request->idUsers;

        if (!$idUsers) {
            return response()->json(['code' => 404, 'data' => 'Usuarios no encontrados'], 404);
        }

        //obtener todos los consultores seleccionados
        $consultantUser = [];
        foreach ($idUsers as $idUser) {
            $consultantUser[] = ConsultantUser::find($idUser);
        }

        //obtener las facturas correspondientes a cada consultor
        $invoicesByUser = $this->getInvoices($idUsers, $startDate, $endDate);

        //verificar que exista algun consultor que tenga facturas
        $existInvoices = false;
        foreach ($invoicesByUser as $invoices) {
            if (count($invoices) != 0) {
                $existInvoices = true;
                break;
            }
        }

        if (!$existInvoices) {
            return response()->json(['code' => 404, 'data' => 'Facturas no encontradas'], 404);
        }

        //obtener datos para la pizza
        $dataPizza = [];
        foreach ($invoicesByUser as $invoices) {
            if (count(($invoices)) != 0) {
                $totalValue = 0;
                foreach ($invoices as $invoice) {
                    $value = $invoice->valor - ($invoice->valor * $invoice->total_imp_inc / 100);
                    $totalValue += $value;
                }

                $dataPizza[] = [
                    'netIncome' => $totalValue,
                    'user' => $consultantUser[array_search($invoice->co_usuario, $idUsers)]
                ];
            }
        }

        return response()->json([
            'code' => 200, 'data' => $dataPizza
        ], 200);
    }
}
