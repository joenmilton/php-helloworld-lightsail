<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Auth::routes();

Route::middleware(['auth', 'excludeRole:user'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/dashboard/stats/dashboard', [App\Http\Controllers\DashboardController::class, 'getDashboardStats']);
    Route::get('/dashboard/stats/client-deal', [App\Http\Controllers\DashboardController::class, 'getClientDealStats']);
    Route::get('/dashboard/stats/created-vs-closed', [App\Http\Controllers\DashboardController::class, 'getStatsCreatedVsClosed']);
    Route::get('/dashboard/stats/by-created-date', [App\Http\Controllers\DashboardController::class, 'getStatsByCreatedDate']);

    Route::get('/contact/{contact}/internal-references', [App\Http\Controllers\ContactResourceController::class, 'getInternalReference']);
    Route::resource('/contact', App\Http\Controllers\ContactResourceController::class);
    
    Route::resource('/admin', App\Http\Controllers\AdminResourceController::class);
    Route::resource('/team', App\Http\Controllers\TeamResourceController::class);

    Route::get('/role/permission_group', [App\Http\Controllers\RoleResourceController::class, 'permission_group']);
    Route::resource('/role', App\Http\Controllers\RoleResourceController::class);
    
    Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home.index');
    Route::get('/settings/deals/pipeline/{pipeline}/edit', [App\Http\Controllers\PipelineResourceController::class, 'edit']);
    
    Route::get('/pipeline/{pipeline}/board', [App\Http\Controllers\PipelineResourceController::class, 'getBoard']);
    Route::post('/pipeline/{pipeline}/board', [App\Http\Controllers\PipelineResourceController::class, 'updateBoard']);
    Route::resource('pipeline', App\Http\Controllers\PipelineResourceController::class);

    Route::post('activity/quick', [App\Http\Controllers\ActivityResourceController::class, 'quickUpdate']);
    Route::get('activity/table/settings', [App\Http\Controllers\ActivityResourceController::class, 'getSettings']);
    Route::get('activity/deal/{deal}', [App\Http\Controllers\ActivityResourceController::class, 'getDealActivities']);
    Route::resource('activity', App\Http\Controllers\ActivityResourceController::class);

    Route::post('deals/{deal}/clone', [App\Http\Controllers\DealResourceController::class, 'cloneDeal']);
    Route::get('deals/{deal}/clone/pipelines', [App\Http\Controllers\DealResourceController::class, 'getClonePipelines']);
    Route::get('deals/{deal}/clone/pipeline/{pipeline}/users', [App\Http\Controllers\DealResourceController::class, 'getCloneUsers']);
    
    Route::post('deals/status', [App\Http\Controllers\DealResourceController::class, 'updateStatus']);
    Route::get('deals/{deal}/timeline', [App\Http\Controllers\ActivityLogController::class, 'getTimeline']);
    Route::post('deals/owner', [App\Http\Controllers\DealResourceController::class, 'updateOwner']);
    Route::post('deals/journal', [App\Http\Controllers\DealResourceController::class, 'updateJournal']);
    Route::post('deals/contact', [App\Http\Controllers\DealResourceController::class, 'updateContact']);
    Route::get('deals/{deal}/billable', [App\Http\Controllers\DealResourceController::class, 'getBillable']);
    Route::post('deals/{deal}/billable', [App\Http\Controllers\DealResourceController::class, 'updateBillable']);
    Route::delete('deals/{deal}/contact', [App\Http\Controllers\DealResourceController::class, 'detachContact']);
    Route::post('deals/stage', [App\Http\Controllers\DealResourceController::class, 'updateStage']);
    Route::get('deals/table/settings', [App\Http\Controllers\DealResourceController::class, 'getSettings']);
    Route::post('deals/table/settings', [App\Http\Controllers\DealResourceController::class, 'updateSettings']);
    Route::resource('deals', App\Http\Controllers\DealResourceController::class);

    Route::resource('products', App\Http\Controllers\ProductResourceController::class);
    

    Route::get('payments/transaction/{transaction}', [App\Http\Controllers\PaymentResourceController::class, 'getTransaction']);
    Route::get('payments/table/settings', [App\Http\Controllers\PaymentResourceController::class, 'getSettings']);
    Route::post('payments/{payment}/status', [App\Http\Controllers\PaymentResourceController::class, 'updateStatus']);
    Route::get('payments/deal/{deal}', [App\Http\Controllers\PaymentResourceController::class, 'getDealPayments']);
    Route::post('payments/delete/bulk', [App\Http\Controllers\PaymentResourceController::class, 'bulkDelete']);
    Route::resource('payments', App\Http\Controllers\PaymentResourceController::class);
    
    Route::post('bank/{bank}/status', [App\Http\Controllers\BankResourceController::class, 'updateStatus']);
    Route::resource('bank', App\Http\Controllers\BankResourceController::class);

    Route::resource('master_journals', App\Http\Controllers\MasterJournalResourceController::class);


    Route::post('journals/revision', [App\Http\Controllers\JournalResourceController::class, 'storeProcessRevision']);
    Route::put('journals/revision/{revision}', [App\Http\Controllers\JournalResourceController::class, 'updateProcessRevision']);

    Route::post('journals/proof', [App\Http\Controllers\JournalResourceController::class, 'storeProcessProof']);
    Route::put('journals/proof/{proof}', [App\Http\Controllers\JournalResourceController::class, 'updateProcessProof']);

    Route::post('journals/processing', [App\Http\Controllers\JournalResourceController::class, 'storeProcessing']);
    Route::put('journals/processing/{processing}', [App\Http\Controllers\JournalResourceController::class, 'updateProcessing']);
    
    Route::put('journals/sheet/{processing}', [App\Http\Controllers\JournalResourceController::class, 'updateSheet']);

    Route::get('journals/table/settings', [App\Http\Controllers\JournalResourceController::class, 'getSettings']);
    Route::post('journals/{payment}/status', [App\Http\Controllers\JournalResourceController::class, 'updateStatus']);
    Route::post('journals/domain', [App\Http\Controllers\JournalResourceController::class, 'createDomain']);
    Route::post('journals/service', [App\Http\Controllers\JournalResourceController::class, 'createService']);
    Route::post('journals/publisher', [App\Http\Controllers\JournalResourceController::class, 'createPublisher']);
    Route::post('journals/journal', [App\Http\Controllers\JournalResourceController::class, 'createJournal']);
    Route::post('journals/activity', [App\Http\Controllers\JournalResourceController::class, 'createActivity']);
    Route::get('journals/deal/{deal}', [App\Http\Controllers\JournalResourceController::class, 'getDealPapers']);
    Route::resource('journals', App\Http\Controllers\JournalResourceController::class);


    Route::get('sheet/process', [App\Http\Controllers\JournalSheetController::class, 'getProcessSheet'])->name('sheet.process');


    Route::post('/media', [App\Http\Controllers\MediaController::class, 'store']);

    Route::resource('filter', App\Http\Controllers\FilterResourceController::class);

    Route::get('/settings', [App\Http\Controllers\SettingsController::class, 'getSettings'])->name('settings.data');
    Route::get('/settings/users/{any}', [App\Http\Controllers\SettingsController::class, 'index'])->name('settings.index');
    Route::get('/settings/{any}', [App\Http\Controllers\SettingsController::class, 'index'])->name('settings.index');
    Route::get('/not-authorized', [App\Http\Controllers\VuesyController::class, 'index'])->name('index');

    Route::get('/report/pipeline-users/{pipeline}', [App\Http\Controllers\ReportController::class, 'getPipelineUsers']);
    Route::post('/report/detailed-report/deal-status-report', [App\Http\Controllers\ReportController::class, 'processDealStatusReport']);
    Route::get('/report/detailed-report/deal-status-report', [App\Http\Controllers\ReportController::class, 'getDealStatusReport'])->name('report.detailed-report');

    Route::get('{any}', [App\Http\Controllers\VuesyController::class, 'index'])->name('index');



    Route::prefix('notifications')->group(function () {
        Route::get('/all', [App\Http\Controllers\NotificationController::class, 'index']);
        Route::get('/unread-count', [App\Http\Controllers\NotificationController::class, 'getUnreadCount']);
        Route::post('/{notificationId}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead']);
        Route::post('/mark-all-read', [App\Http\Controllers\NotificationController::class, 'markAllAsRead']);
    });

    Route::post('/logout', [App\Http\Controllers\Auth\LoginController::class, 'logout']);

});

Route::middleware(['auth', 'role:user'])->group(function () {
    // Route::get('/dashboard', [UserController::class, 'dashboard'])->name('user.dashboard');
});

Route::post('/password/email', [App\Http\Controllers\ForgotPasswordController::class, 'sendOtp'])->name('password.request');
Route::post('/password/reset', [App\Http\Controllers\ResetPasswordController::class, 'verifyOtp']);

Route::get('/password/reset', [App\Http\Controllers\ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.reset');
Route::get('/password/verify/otp', [App\Http\Controllers\ResetPasswordController::class, 'showOtpResetForm'])->name('password.reset.form');

// Route::post('/password/email', [App\Http\Controllers\ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.request');
// Route::post('/password/reset', [App\Http\Controllers\ResetPasswordController::class, 'reset']);
// Route::get('/password/reset/{token}', [App\Http\Controllers\ResetPasswordController::class, 'showResetForm']);

