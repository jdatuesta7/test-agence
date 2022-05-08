<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $table = 'cao_fatura';

    protected $primaryKey = 'co_fatura';

    protected $fillable = [
        'co_cliente',
        'co_sistema',
        'co_os',
        'num_nf',
        'total',
        'valor',
        'data_emissao',
        'corpo_nf',
        'comissao_cn',
        'total_imp_inc',
    ];

    public function consultantUser()
    {
        return $this->belongsTo(Client::class, 'co_cliente');
    }
}
