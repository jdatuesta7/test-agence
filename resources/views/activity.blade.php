@extends('app')

<div class="p-4">
    <h1 class="text-center mt-2 mb-4">Control de actividades</h1>

    @if (session('error'))
        <div class="alert alert-danger" role="alert">
            {{ session('error') }}
        </div>
    @endif

    @include('filter')

    <div class="row">
        <div class="col-md-6 col-12 mt-2">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Consultores disponibles</h3>
                </div>
                <!-- /.card-header -->
                <div class="card-body">
                    <table id="available-users-table" class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Consultor</th>
                            </tr>
                        </thead>
                        <tbody id="available-users-tbody">
                            @forelse ($consultantUsers as $item)
                                <tr id="{{ $item->co_usuario }}">
                                    <td style="vertical-align:middle;">{{ $item->no_usuario }}</td>
                                    <td align="center">
                                        <button type="button" class="btn-move btn btn-primary"> <i
                                                class='bx bx-chevron-right bx-sm'></i> </button>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td>No hay consultores disponibles</td>
                                </tr>
                            @endforelse
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Consultor</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <!-- /.card-body -->
            </div>
            <!-- /.card -->
        </div>

        <div class="col-md-6 col-12 mt-2">
            <form method="POST" id="form" action="activity-report">
                @csrf

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Consultores seleccionados</h3>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body">
                        <table id="selected-users-table" class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Consultor</th>
                                </tr>
                            </thead>
                            <tbody id="selected-users-tbody">
                                <tr id="selected-empty-row">
                                    <td>No ha seleccionado consultores</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Consultor</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </form>
        </div>
    </div>

    <div class="row gap-1 mt-4">
        <div class="col-md-2 col-12">
            <button id="report-btn" type="button" class="btn btn-primary btn-block col-12">Reporte <i
                    class='bx bxs-report'></i></button>
        </div>
        <div class="col-md-2 col-12">
            <button id="graph-btn" type="button" class="btn btn-secondary btn-block col-12">Gráfico <i
                    class='bx bx-line-chart'></i></button>
            <button hidden id="modal-btn" tabindex="-1" type="button" data-toggle="modal" data-bs-toggle="modal"
                data-bs-target="#graph-modal"></button>
        </div>
        <div class="col-md-2 col-12">
            <button id="pizza-btn" type="button" class="btn btn-success btn-block col-12">Pizza <i class='bx bxs-pizza'></i></button>
            <button hidden id="modal-pizza-btn" hidden tabindex="-1" type="button" data-toggle="modal" data-bs-toggle="modal"
                data-bs-target="#pizza-modal"></button>
        </div>
    </div>

    @include('graph')
    @include('pizza')
</div>
