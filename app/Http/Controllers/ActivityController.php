<?php

namespace App\Http\Controllers;

use App\Models\ConsultantUser;
use App\Models\Invoice;
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
        }else{
            return response()->json(['code' => 404, 'data' => 'Consultant user not found'], 404);
        }

    }

    public function generateReport(Request $request)
    {
        $idUsersSelected = $request->except(['_token', 'startDate', 'endDate']);
        //obtener todos los consultores seleccionados
        $consultantUser = [];
        foreach ($idUsersSelected['selected_users'] as $idUser) {
            $consultantUser[] = ConsultantUser::find($idUser);
        }
        
        //obtener todas las facturas del consultor
        $allInvoices = [];

        $startDate = $request->startDate;
        $endDate = $request->endDate;

        if ($startDate && $endDate) {
            foreach ($idUsersSelected['selected_users'] as $idUserSelected) {
                $allInvoices[] = DB::table("cao_fatura")
                    ->where("cao_fatura.data_emissao", ">=", $startDate)
                    ->where("cao_fatura.data_emissao", "<=", $endDate)
                ->join("cao_os", "cao_fatura.co_os", "=", "cao_os.co_os")
                    ->where("cao_os.co_usuario", "=", $idUserSelected)
                ->join("cao_sistema", "cao_fatura.co_sistema", "=", "cao_sistema.co_sistema")
                    ->where("cao_sistema.co_usuario", "=", $idUserSelected)
                ->join("cao_cliente", "cao_fatura.co_cliente", "=", "cao_cliente.co_cliente")
                ->get();
            }
        }else{
            foreach ($idUsersSelected['selected_users'] as $idUserSelected) {
                $allInvoices[] = DB::table("cao_fatura")
                ->join("cao_os", "cao_fatura.co_os", "=", "cao_os.co_os")
                    ->where("cao_os.co_usuario", "=", $idUserSelected)
                ->join("cao_sistema", "cao_fatura.co_sistema", "=", "cao_sistema.co_sistema")
                    ->where("cao_sistema.co_usuario", "=", $idUserSelected)
                ->join("cao_cliente", "cao_fatura.co_cliente", "=", "cao_cliente.co_cliente")
                ->get();
            }
        }

        //obtener ganancias netas de cada consultor
        $dataReport = [];
        foreach ($allInvoices as $invoices) {
            $warning = false;
            if(count(($invoices)) != 0) {
                $totalValue = 0;
                foreach ($invoices as $invoice) {
                    $totalValue += $invoice->valor - ($invoice->valor * $invoice->total_imp_inc / 100);
                }
                //obtener costo fijo de cada consultor
                $fixedCost = DB::table("cao_salario")->where("co_usuario", "=", $invoice->co_usuario)->first();
                if ($fixedCost) {
                    $dataReport[] = [
                        'fixedCost' => $fixedCost->brut_salario,
                        'netIncome' => $totalValue,
                        'user' => $consultantUser[array_search($invoice->co_usuario, $idUsersSelected['selected_users'])]
                    ];
                }else{
                    $dataReport[] = [
                        'fixedCost' => 'N/A',
                        'netIncome' => $totalValue,
                        'user' => $consultantUser[array_search($invoice->co_usuario, $idUsersSelected['selected_users'])]
                    ];
                }

                
            }else{
                $warning = true;
            }
        }

        return view('report', compact('dataReport', 'warning'));
    }

}
