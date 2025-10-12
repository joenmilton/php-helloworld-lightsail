<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use League\OAuth2\Server\AuthorizationServer;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [App\Http\Controllers\API\User\AuthController::class, 'login']);
Route::post('/register', [App\Http\Controllers\API\User\AuthController::class, 'register']);
Route::post('/forgot/password', [App\Http\Controllers\API\User\AuthController::class, 'forgotPassword']);
Route::post('/mobile/login', [App\Http\Controllers\API\User\TokenController::class, 'authenticate']);
Route::post('/verify/otp', [App\Http\Controllers\API\User\TokenController::class, 'verifyMobileOtp']);

Route::post('/reset/email', [App\Http\Controllers\API\User\TokenController::class, 'resetOtpMail']);
Route::post('/verify/email', [App\Http\Controllers\API\User\TokenController::class, 'verifyEmailOtp']);

Route::group(['middleware' => ['auth:api']], function() {
    
    Route::post('/logout', [App\Http\Controllers\API\User\TokenController::class, 'logout']);
    Route::post('/account/change-password', [App\Http\Controllers\API\User\AccountController::class, 'changePassword']);
    Route::get('/account/profile', [App\Http\Controllers\API\User\AccountController::class, 'getProfile']);

    Route::get('deals/{deal}/message', [App\Http\Controllers\API\User\DealResourceController::class, 'getDealMessage']);
    Route::post('deals/{deal}/message', [App\Http\Controllers\API\User\DealResourceController::class, 'addDealMessage']);
    Route::post('deals/{deal}/upload', [App\Http\Controllers\API\User\DealResourceController::class, 'uploadClientFile']);
    Route::get('deals/{deal}/journal', [App\Http\Controllers\API\User\DealResourceController::class, 'getDealPapers']);
    Route::get('deals/{deal}/payment', [App\Http\Controllers\API\User\DealResourceController::class, 'getDealPayments']);
    Route::get('deals/{deal}/billable', [App\Http\Controllers\API\User\DealResourceController::class, 'getBillable']);
    Route::get('deals/settings', [App\Http\Controllers\API\User\DealResourceController::class, 'getSettings']);
    Route::resource('deals', App\Http\Controllers\API\User\DealResourceController::class);
});
