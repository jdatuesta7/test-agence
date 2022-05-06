<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Laravel</title>
    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">

    <!-- Libraries -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link href='https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css' rel='stylesheet'>
</head>

<body>
    <h1 class="text-center mt-2 mb-4">Control de actividades</h1>
    <div class="container">
        <div class="col-md-12">
            @include('filter')

            <div class="row gap-0">
                <div class="col-md-6 col-12">
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
                                                <button class="btn-move btn btn-primary"> <i class='bx bx-chevron-right bx-sm' ></i> </button> 
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


                <div class="col-md-6 col-12">
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
            </div>

            <div class="row gap-1 mt-4 text-center">
                <div class="col-md-3 col-12">
                    <button type="button" class="btn btn-primary btn-block col-11">Reporte <i class='bx bxs-report'></i></button>
                </div>
                <div class="col-md-3 col-12">
                    <button type="button" class="btn btn-secondary btn-block col-11">Gráfico <i class='bx bx-line-chart'></i></button>
                </div>
                <div class="col-md-3 col-12">
                    <button type="button" class="btn btn-success btn-block col-11">Pizza <i class='bx bxs-pizza' ></i></button>
                </div>
            </div>

            @include('report')
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous">
    </script>
</body>

</html>
