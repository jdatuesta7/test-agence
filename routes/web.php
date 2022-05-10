<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ActivityController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [ActivityController::class, 'index']);

Route::get('/consultant-user/{co_usuario}', [ActivityController::class, 'getConsultantUser']);

Route::post('/activity-report', [ActivityController::class, 'generateReport']);

Route::post('/data-graph', [ActivityController::class, 'showGraph']);

Route::post('/data-pizza', [ActivityController::class, 'showPizza']);

