@extends('app')

<div class="p-4">
    <h1 class="text-center mt-2 mb-4"> REPORTE DE FACTURAS OBTENIDAS</h1>
    @foreach ($netIncome as $item)
    <div class="row gap-1 mt-4">
        <div class="col-md-12 col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Reporte de {{ $item['user']->no_usuario}} </h3>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive">
                    <table id="example1" class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Periodo</th>
                                <th>Ingresos netos</th>
                                <th>Costo fijo</th>
                                <th>Comisión</th>
                                <th>Ganancia</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>PERIODO</td>
                                <td>R$ {{ number_format($item['netIncome'], 2, ',', '.') }}</td>
                                <td>COSTO FIJO</td>
                                <td>COMISION</td>
                                <td>GANANCIA</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- /.card-body -->
            </div>
        </div>
    </div>
    @endforeach

    @if ($warning)
    <div class="row gap-1 mt-4">
        <div class="col-md-12 col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Algunos usuarios consultados no poseen facturas</h3>
                </div>
            </div>
        </div>
    </div>
    @endif
   
</div>
