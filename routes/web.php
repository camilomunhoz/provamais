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
use App\Http\Controllers\UpdateQuestionController;
use App\Http\Controllers\FilterQuestionsController;
use App\Http\Controllers\FilterMyQuestionsController;
use App\Http\Controllers\DocQuestionsController;
use App\Http\Controllers\DocController;
use App\Http\Controllers\RemoveQuestionController;
use App\Http\Controllers\PDFController;

// Página inicial
Route::get('/', [ViewController::class, 'index']);

// Documentos
Route::get('/my_docs', [ViewController::class, 'my_docs']);
Route::get('/create_doc', [ViewController::class, 'create_doc']);
Route::get('/edit_doc/{id}', [ViewController::class, 'edit_doc']);
Route::post('/store_doc', [DocQuestionsController::class, 'store']);
Route::post('/update_doc', [DocQuestionsController::class, 'update']);
Route::post('/my_docs/rename/{id}', [DocController::class, 'rename']);
Route::get('/my_docs/remove/{id}', [DocController::class, 'remove']);
Route::get('/my_docs/duplicate/{id}', [DocController::class, 'duplicate']);
Route::get('/my_docs/get', [DocController::class, 'get']);
Route::post('/search_docs', [DocController::class, 'search']);

// Questões
Route::get('/my_quests', [ViewController::class, 'my_quests']);
Route::get('/create_quest', [ViewController::class, 'create_quest']);
Route::get('/edit_quest/{id}', [ViewController::class, 'edit_quest']);
Route::get('/remove_quest/{id}', [RemoveQuestionController::class, 'remove_quest']);
Route::get('/search_quests', [ViewController::class, 'search_quests']);
Route::get('/insert_doc_quests', [DocQuestionsController::class, 'get']);

Route::post('/store_question', [StoreQuestionController::class, 'store_question']);
Route::post('/update_question', [UpdateQuestionController::class, 'update_question']);
Route::post('/favorite_question', [FilterQuestionsController::class, 'favorite']);
Route::post('/filter_quests', [FilterQuestionsController::class, 'filter']);
Route::post('/search_quests', [FilterQuestionsController::class, 'search']);
Route::post('/filter_my_quests', [FilterMyQuestionsController::class, 'filter']);
Route::post('/search_my_quests', [FilterMyQuestionsController::class, 'search']);
Route::post('/filter_doc_quests', [DocQuestionsController::class, 'filter']);

// Perfil
Route::get('/my_profile', [ViewController::class, 'my_profile']);
Route::get('/profile/{id}', [ViewController::class, 'show_profile']);
Route::post('/update_profile', [UpdateProfileController::class, 'update_profile']);

// PDF
Route::get('/pdf/{id}', [PDFController::class, 'pdf_doc']);
Route::get('/pdf/{id}/answers', [PDFController::class, 'pdf_answers']);

// Ajuda
Route::get('/help', [ViewController::class, 'help']);

// Autenticação
Route::get('/logout', [AuthController::class, 'logout']);
Route::post('/register', [AuthController::class, 'register_user']);
Route::post('/login', [AuthController::class, 'login']);
