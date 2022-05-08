@extends('app')

<div class="p-4">
    <h1 class="text-center mt-2 mb-4"> REPORTE DE FACTURAS OBTENIDAS</h1>
    <h1 class="text-center mt-2 mb-4">{{ $startDate && $endDate ? ('PERIODOS '. $startDate - $endDate) : 'TODOS LOS PERIODOS' }}</h1>

    @foreach ($dataReport as $item)
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
                                <th>Ingresos netos</th>
                                <th>Costo fijo</th>
                                <th>Comisión</th>
                                <th>Ganancia</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>R$ {{ number_format($item['netIncome'], 2, ',', '.') }}</td>
                                <td>{{ $item['fixedCost'] != 'N/A' ? '- R$'.number_format($item['fixedCost'], 2, ',', '.') : 'N/A' }}</td>
                                <td>- R$ {{ number_format($item['comission'], 2, ',', '.') }}</td>
                                @if ($item['profit'] * -1 > 0)
                                    <td class="text-danger">- R$ {{ number_format($item['profit'], 2, ',', '.') }}</td>
                                @elseif ($item['profit'] * -1 < 0)
                                    <td class="text-success">R$ {{ number_format($item['profit'], 2, ',', '.') }}</td>
                                @endif
                                
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
                    <h3 class="card-title">Algunos usuarios consultados no poseen facturas disponibles o en el periodo seleccionado</h3>
                </div>
            </div>
        </div>
    </div>
    @endif
   
</div>
