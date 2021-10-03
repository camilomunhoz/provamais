<?php

use Illuminate\Support\Facades\Route;

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

use App\Http\Controllers\ViewController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UpdateProfileController;
use App\Http\Controllers\StoreQuestionController;

// Página inicial
Route::get('/', [ViewController::class, 'index']);

// Documentos
Route::get('/my_docs', [ViewController::class, 'my_docs']);
Route::get('/create_doc', [ViewController::class, 'create_doc']);

// Questões
Route::get('/my_quests', [ViewController::class, 'my_quests']);
Route::get('/create_quest', [ViewController::class, 'create_quest']);
Route::get('/search_quests', [ViewController::class, 'search_quests']);

// Outros
Route::get('/my_profile', [ViewController::class, 'my_profile']);
Route::get('/help', [ViewController::class, 'help']);

// Rotas para validar os formulários em geral
Route::post('/update_profile', [UpdateProfileController::class, 'update_profile']);
Route::post('/store_question', [StoreQuestionController::class, 'store_question']);

// Autenticação
Route::get('/logout', [AuthController::class, 'logout']);
Route::post('/register', [AuthController::class, 'register_user']);
Route::post('/login', [AuthController::class, 'login']);
