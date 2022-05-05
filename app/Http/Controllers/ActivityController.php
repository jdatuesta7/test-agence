<?php

namespace App\Http\Controllers;

use App\Models\ConsultantUser;
use Illuminate\Http\Request;

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

    public function addConsultantUser($co_usuario)
    {
        $consultantUser = ConsultantUser::find($co_usuario);

        if (!empty($consultantUser)) {
            return response()->json(['code' => 200, 'data' => $consultantUser], 200);
        }else{
            return response()->json(['code' => 404, 'data' => 'Consultant user not found'], 404);
        }

    }
}
