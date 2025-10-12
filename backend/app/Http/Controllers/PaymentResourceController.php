<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Media;
use App\Models\User;
use App\Models\Deal;
use App\Models\Payment;
use App\Models\Bank;
use App\Models\Billable;
use App\Models\BillableProduct;
use App\Models\Filter;
use App\Rules\IsoDate;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Auth;
use Validator;
use Setting;

use App\Sigapps\Filters\Date as DateFilter;
use App\Sigapps\Filters\Text as TextFilter;
use App\Sigapps\Filters\Numeric as NumericFilter;
use App\Sigapps\Filters\Select as SelectFilter;

class PaymentResourceController extends Controller
{

    private function getNoSplit(Request $request, $deal_id) {
        $paymentsQuery = Payment::where('payable_type', Deal::class)
            ->where('payable_id', $deal_id)
            ->whereNull('deleted_at')
            ->orderBy('paid_at', 'DESC')
            ->with('media:id,mediable_id,mediable_type,file_name,file_path,file_size,created_at');
        return $paymentsQuery->paginate($request->per_page ?? 25);
    }

    private function getServiceSplit(Request $request, $deal_id) {

        $data['included'] = []; 
        $data['excluded'] = [];

        $billable = Billable::where('billableable_type', Deal::class)
            ->where('billableable_id', $deal_id)
            ->first();
        if(is_null($billable)) {
            return $data;
        }

        $included = $billable->getProductSummaryWithPayments();
        $includedPaymentIds = $included->pluck('payments.*.id')->flatten();

        $excluded = Payment::select('payments.*')
            ->addSelect('products.name')
            ->leftJoin('products', 'products.id', '=', 'payments.product_id')
            ->where('payments.payable_type', Deal::class)
            ->where('payments.payable_id', $deal_id)
            ->whereNotIn('payments.id', $includedPaymentIds)
            ->whereNull('payments.deleted_at')
            ->get()
            ->map(function($payment) {
                return [
                    'id' => $payment->id,
                    'name' => $payment->name,
                    'paid_amount' => $payment->paid_amount,
                    'media' => $payment->media,
                    'description' => $payment->description,
                    'paid_at' => $payment->paid_at,
                    'is_loading' => false,
                    'status' => $payment->status,
                ];
            });

        $data['included'] = $included; 
        $data['excluded'] = $excluded;

        return $data;
    }


    public function getDealPayments(Request $request, $deal_id) {

        $deal = Deal::where('id', $deal_id)->first();
        if(is_null($deal)) {
            return $this->response(null, 'Deal not valid', [], 400);
        }
        $deal_id = !is_null($deal->parent_id) ? $deal->parent_id : $deal->id;
        
        return $this->response($this->getPayments($request, $deal_id), '');
    }

    private function getPayments(Request $request, $deal_id) {
        $payment_screen = Setting::get('payment_screen', 'no_split');

        switch ($payment_screen) {
            case 'no_split':
                return $this->getNoSplit($request, $deal_id);
            case 'service_split':
                return $this->getServiceSplit($request, $deal_id);
            default:
                return [];
        }
    }






    public function updateStatus(Request $request, string $id) {
        if ($request->ajax()) {

            $validator = Validator::make($request->all(), [
                'status' => 'in:0,1'
            ]);
            if ($validator->fails()) { 
                return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
            }

            DB::beginTransaction();
            try {
                $payment = Payment::where('id', $id)->first();
                if(is_null($payment)) {
                    return $this->response(null, 'Payment not valid', [], 400);
                }

                $payment->status = $request->status;
                $payment->save();

                $payment->payable->updatePaidAmount();

                $payment->logPaymentChange('payment_status');
                DB::commit();

                return $this->response($payment->status, 'Payment status updated');
            } catch (\Exception $e) {
                DB::rollback();
                return $this->response(null, 'Something went wrong', [], 400);
            }
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $query = Payment::getVisiblePayments()
                ->applyFilter($request->all(), 'payments')
                ->applySort($request->all(), 'payments');

            $payments = $query->select(
                    'payments.*', 
                    'products.name as product_name', 
                    'deals.id as deal_id',
                    'deals.name',
                    'contact.name as client_name',
                    'owner.name as owner_name'
                )
                ->with('bank:id,name')
                ->with('media')
                ->paginate($request->per_page);

            return $this->response($payments, '');
        }

        return view('admin.payment.index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $rule = [
            'deal_id' => 'required',
            'product_id' => 'required',
            'paid_amount' => 'required|min:1|numeric',
            'paid_at' => ['required', new IsoDate],
            'transaction_type' => 'required|in:bank,cash'
        ];

        if($request->has('attachment')) {
            $rule['attachment'] = 'nullable|mimes:jpg,jpeg,png|max:2048';
        }

        if($request->has('transaction_type') && $request->transaction_type == 'bank') {
            $rule['bank_id']        = 'required';
            $rule['transaction_id'] = 'required';
        }

        $validator = Validator::make($request->all(), $rule);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }
        
        DB::beginTransaction();
        try {
            $deal = Deal::where('id', $request->deal_id)->first();
            if(is_null($deal)) {
                return $this->response(null, 'Deal not valid', [], 400);
            }
            $deal_id = !is_null($deal->parent_id) ? $deal->parent_id : $deal->id;


            $payment = new Payment;
            $payment->id  = (string) Str::uuid();
            $payment->payable_type  = Deal::class;
            $payment->payable_id    = $deal_id;
            $payment->product_id    = $request->product_id;
            $payment->paid_amount   = $request->paid_amount;
            $payment->description   = $request->has('description') ? $request->description : '';
            $payment->paid_at       = Carbon::parse($request->paid_at);
            $payment->status        = 0;
            $payment->transaction_type        = $request->transaction_type;
            $payment->transaction_split     = 1;

            if($request->has('transaction_type') && $request->transaction_type == 'bank') {
                $payment->bank_id               = $request->bank_id;
                $payment->transaction_id        = $request->transaction_id;
                $payment->transaction_split     = $this->getTransactionSplit(str_replace(' ', '', $request->transaction_id));
            }
            $payment->save();

            if($request->has('existing_media') && is_array($request->existing_media) && count($request->existing_media) > 0) {
                foreach($request->existing_media as $media_id) {
                    $existing_media = Media::where('id', $media_id)->first();
                    if(!is_null($existing_media)) {

                        $cloned_media = $existing_media->replicate();
                        $cloned_media->save();

                        $payment->media()->save($cloned_media);
                    }
                }
            }

            if($request->has('attachment') ) {

                $file       = $request->file('attachment');
                $fileName   = $file->getClientOriginalName();
                $filePath   = $file->store('uploads/receipt', 'public');
                $fileSize   = $file->getSize();

                $media = new Media([
                    'file_name' => $fileName,
                    'file_size' => $fileSize,
                    'file_path' => $filePath,
                    'user_id' => Auth::id()
                ]);
    
                $payment->media()->save($media);
            }

            $payment->payable->updatePaidAmount();
            DB::commit();

            $payment->logPaymentChange('payment_change');
            return $this->response($this->getPayments($request, $deal_id), '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $rule = [];
        if($request->has('attachment')) {
            $rule['attachment'] = 'nullable|mimes:jpg,jpeg,png|max:2048';
        }

        $validator = Validator::make($request->all(), $rule);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $payment = Payment::where('id', $id)->first();
            if(is_null($payment)) {
                return $this->response(null, 'Payment not valid', [], 400);
            }

            if($request->has('attachment') ) {
                $file       = $request->file('attachment');
                $fileName   = $file->getClientOriginalName();
                $filePath   = $file->store('uploads/receipt', 'public');
                $fileSize   = $file->getSize();

                $media = new Media([
                    'file_name' => $fileName,
                    'file_size' => $fileSize,
                    'file_path' => $filePath,
                    'user_id' => Auth::id()
                ]);
    
                $payment->media()->save($media);
            }

            $payment->payable->updatePaidAmount();
            DB::commit();

            return $this->response($this->getPayments($request, $payment->payable_id), '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function bulkDelete(Request $request) {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array|min:1'
        ]);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        try{
            DB::beginTransaction();
            foreach($request->ids as $payment_id) {
                $payment = Payment::where('id', $payment_id)->first();
                if(!is_null($payment)) {
                    $payment->status = false;
                    $payment->save();

                    $payment->delete();
                    $payment->payable->updatePaidAmount();
                }
            }
            DB::commit();
            return $this->response([], 'Selected payments deleted');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }

    private function getPaymentSettings(Request $request) {

        $data['payment_screen']         = Setting::get('payment_screen', 'no_split');
        $data['payment_types']          = [
            [
                'label' => 'Cash',
                'value' => 'cash'
            ],
            [
                'label' => 'Bank',
                'value' => 'bank'
            ]
        ];

        $deal = Deal::where('id', $request->deal_id)->first();
        $data['available_products'] = [];
        if(!is_null($deal)) {
            $deal_id = !is_null($deal->parent_id) ? $deal->parent_id : $deal->id;
            $data['available_products']     = BillableProduct::select('products.id', 'products.name')
                ->join('billables', 'billables.id', '=', 'billable_products.billable_id')
                ->join('products', 'products.id', '=', 'billable_products.product_id')
                ->where('billables.billableable_id', $deal_id)
                ->where('billables.billableable_type', Deal::class)
                ->groupBy('billable_products.product_id')
                ->get();
        }

        $data['rules'] = [
            TextFilter::make('deals.name', __('fields.deals.name'))
                ->withoutEmptyOperators()
                ->jsonSerialize(),
            SelectFilter::make('payments.bank_id', __('fields.payments.bank'))
                ->labelKey('name')
                ->valueKey('id')
                ->options(function(){
                    return app(Bank::class)
                        ->select('id', 'name')
                        ->get();
                })
                ->jsonSerialize(),
            NumericFilter::make('payments.paid_amount', __('fields.payments.paid_amount'))
                ->jsonSerialize(),
            SelectFilter::make('payments.status', __('fields.payments.payment_status'))
                ->labelKey('name')
                ->valueKey('id')
                ->options([['id' => 0, 'name' => 'Not Verified'], ['id' => 1, 'name' => 'Verified']])
                ->jsonSerialize(),
            DateFilter::make('payments.paid_at', __('fields.payments.payment_date'))
                ->jsonSerialize(),
            // SelectFilter::make('deals.contact_id', __('fields.deals.client'))
            //     ->labelKey('name')
            //     ->valueKey('id')
            //     ->options(function(){
            //         return app(User::class)
            //             ->role('user')
            //             ->select('id', 'name')
            //             ->get();
            //     })
            //     ->jsonSerialize(),
        ];

        $user = Auth::user();
        $data['filters']           = Filter::where('identifier', 'payments')
            ->where(function ($q) use ($user) {
                $q->whereNull('user_id')
                    ->orWhere('is_shared', true)
                    ->orWhere('user_id', $user->id);
            })
            ->get();

        $data['available_banks'] = Bank::select('id', 'name')
            ->where('active', true)
            ->whereNull('deleted_at')
            ->get();

        return $data;
    }

    public function getSettings(Request $request) {
        $data = $this->getPaymentSettings($request);
        return $this->response($data, '');
    }

    private function getLastTransaction(string $id) {
        return Payment::select('id', 'transaction_id', 'transaction_split')
            ->with('media:id,mediable_id,mediable_type,file_name,file_path,file_size,created_at')
            ->where('transaction_type', 'bank')
            ->where('transaction_id', $id)
            ->orderBy('transaction_split', 'DESC')
            ->whereNull('deleted_at')
            ->first();
    }

    public function getTransaction(Request $request, string $id) {
        $payment = $this->getLastTransaction(str_replace(' ', '', $id));
        return $this->response($payment, '');
    }

    private function getTransactionSplit($id) {
        $payment = $this->getLastTransaction($id);
        return (is_null($payment)) ? 1 : $payment->transaction_split+1;
    }
    
}
