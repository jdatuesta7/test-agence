<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemPermission extends Model
{
    protected $table = 'permissao_sistema';

    protected $primaryKey = ['co_usuario', 'co_tipo_usuario', 'co_sistema'];

    public $incrementing = false;

    protected $fillable = [
        'co_usuario',
        'co_tipo_usuario',
        'co_sistema',
        'in_ativo',
        'co_usuario_actualizacao',
        'dt_actualizacao',
    ];

    public function consultantUsers()
    {
        return $this->belongsTo(ConsultantUser::class, 'co_usuario');
    }
}
