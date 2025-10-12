<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Payment;
use App\Models\Billable;
use App\Models\Deal;
use App\Models\Paper;
use App\Models\Activity;
use App\Models\Comment;
use App\Models\Media;
use Validator;
use Setting;
use Auth;

class DealResourceController extends Controller
{

    public function getBillableData($id) {

        $deal = Deal::where('id', $id)->first();
        if(is_null($deal)) {
            return null;
        }

        $billable = $deal->billableable;
        if(is_null($billable)) {
            return null;
        }

        $result = [
            'id' => $billable->id,
            'tax_type' => $billable->tax_type,
            'subtotal' => Billable::round($billable->subTotal),
            'total' => Billable::round($billable->total),
            'total_tax' => Billable::round($billable->totalTax),
            'taxes' => $billable->getAppliedTaxes(),
            'has_discount' => $billable->hasDiscount,
            'total_discount' => Billable::round($billable->totalDiscount),
            'products' => $billable->products->map(function ($product) {
                return [
                    'id' => $product->id,
                    'product_id' => $product->product_id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'unit_price' => Billable::round($product->unit_price),
                    'qty' => Billable::round($product->qty),
                    'unit' => $product->unit,
                    'tax_rate' => Billable::round($product->tax_rate),
                    'tax_label' => $product->tax_label,
                    'discount_type' => $product->discount_type,
                    'discount_total' => Billable::round($product->discount_total),
                    'note' => $product->note,
                    'amount' => Billable::round($product->amount),
                    'sku' => $product->sku,
                ];
            })->toArray(),
        ];

        return $result;
    }

    public function getBillable(Request $request, string $id) {
        $billable = $this->getBillableData($id);
        if(is_null($billable)) {
            return $this->appResponse(null, null, 422, 'No service added!');
        }

        return $this->appResponse($billable, null, 200, '');
    }

    public function getSettings() {
        $data['custom_fields']      = Setting::get('custom_fields', []);
        $data['journal_status']     = Setting::get('journals', []);
        
        
        return $this->appResponse($data, null, 200, '');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $deals = Deal::where('contact_id', Auth::id())
            ->with(['taskActivities'])
            ->whereNull('parent_id')
            ->orderBy('created_at', 'DESC')
            ->paginate($request->per_page);


        return $this->appResponse($deals, null, 200, '');
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $deal = Deal::where('id', $id)
            ->with('customFields:field_name,field_value,model_type,model_id')
            ->with(['taskActivities', 'clientTaskActivity' => function($query) {
                $query->with(['media' => function($query) {
                    $query->select('id','user_id','mediable_id','mediable_type','file_name','file_path','file_size','created_at');
                    $query->with('user');
                }]);
            }])
            ->where('contact_id', Auth::id())
            ->whereNull('parent_id')
            ->first();
        if(is_null($deal)) {
            return $this->appResponse(null, null, 422, 'Deal not valid!');
        }

        return $this->appResponse($deal, null, 200, '');
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }











    public function getDealPayments(Request $request, $deal_id) {

        $deal = Deal::where('id', $deal_id)->first();
        if(is_null($deal)) {
            return $this->appResponse(null, null, 422, 'Deal not valid!');
        }
        $deal_id = !is_null($deal->parent_id) ? $deal->parent_id : $deal->id;
        
        return $this->appResponse($this->getPayments($request, $deal_id), null, 200, '');
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






    public function getDealPapers(Request $request, $deal_id) {

        $deal = Deal::where('id', $deal_id)->first();
        if(is_null($deal)) {
            return $this->appResponse(null, null, 422, 'Deal not valid!');
        }
        $deal_id = !is_null($deal->parent_id) ? $deal->parent_id : $deal->id;

        $papers = Paper::select('papers.*')
            ->with(['processing' => function($query) {
                $query->where('shared', true);
                $query->with([
                    'submission' => function ($query) {
                        $query->select('*');
                        $query->orderBy('created_at', 'DESC');
                        $query->with([
                            'staff:id,name'
                        ]);
                    },
                    'revisions' => function ($query) {
                        $query->select('*');
                        $query->orderBy('created_at', 'DESC');
                        $query->with([
                            'staff:id,name'
                        ]);
                    },
                    'proof',
                    'journal:id,journal_name', 'publisher:id,name'
                ]);
            }, 'domain:id,name', 'service:id,name'])
            ->whereNull('papers.deleted_at')
            ->where('papers.journalable_type', Deal::class)
            ->where('papers.journalable_id', $deal_id)
            ->paginate();
        
        return $this->appResponse($papers, null, 200, '');
    }



    public function uploadClientFile(Request $request, $deal_id) {
        $rule = [
            'file' => 'required|mimes:jpg,jpeg,png,pdf,doc,docx,ppt,pptx,xls,xlsx|max:20480'
        ];

        $validator = Validator::make($request->all(), $rule);
        if ($validator->fails()) {
            return $this->appResponse(null, $validator->errors(), 422, 'Validation failed');
        }
        DB::beginTransaction();
        try {

            $deal = Deal::where('id', $deal_id)->first();
            if(is_null($deal)) {
                return $this->appResponse(null, null, 422, 'Deal not valid!');
            }

            $activity = $deal->createClientTask();

            $file       = $request->file('file');
            $fileName   = $file->getClientOriginalName();
            $filePath   = $file->store('uploads', 'public');
            $fileSize   = $file->getSize();

            // Create the media record
            $media = new Media([
                'id' => (string) Str::uuid(), // Generate a UUID for the media
                'file_name' => $fileName,
                'file_size' => $fileSize,
                'file_path' => $filePath,
                'user_id' => Auth::id()
            ]);

            $activity->media()->save($media);
            DB::commit();

            return $this->show($deal_id);
            
        } catch (\Exception $e) {
            DB::rollback();
            return $this->appResponse(null, null, 422, 'Something went wrong');
        }
    }


    public function getComments(Request $request, $task_id) {
        $comments = Comment::where('commentable_type', Activity::class)
            ->where('commentable_id', $task_id)
            ->with(['user' => function($query) {
                $query->select('id', 'name');
            }])
            ->orderBy('created_at', 'DESC')
            ->paginate($request->per_page);

        return $this->appResponse($comments, null, 200, '');
    }


    public function getDealMessage(Request $request, $deal_id) {
        $deal = Deal::where('id', $deal_id)->first();
        if(is_null($deal)) {
            return $this->appResponse(null, null, 422, 'Deal not valid!');
        }
        $parent_deal = !is_null($deal->parent_id) ? $deal->parent : $deal;

        $client_task = $parent_deal->createClientTask();
        if(is_null($client_task)) {
            return $this->appResponse(null, null, 422, 'Task not valid!');
        }

        return $this->getComments($request, $client_task->id);
    }

    public function addDealMessage(Request $request, $deal_id) {
        $validator = Validator::make($request->all(), [
            'comment' => 'required'
        ]);
        if ($validator->fails()) {
            return $this->appResponse(null, $validator->errors(), 422, 'Validation failed');
        }

        DB::beginTransaction();
        try {
            $deal = Deal::where('id', $deal_id)->first();
            if(is_null($deal)) {
                return $this->appResponse(null, null, 422, 'Deal not valid!');
            }
            $parent_deal = !is_null($deal->parent_id) ? $deal->parent : $deal;
    
            $client_task = $parent_deal->createClientTask();
            if(is_null($client_task)) {
                return $this->appResponse(null, null, 422, 'Task not valid!');
            }

            $comment = new Comment([
                'user_id' => Auth::id(),
                'body' => $request->comment
            ]);
            $client_task->comments()->save($comment);
            DB::commit();
            
            return $this->getComments($request, $client_task->id);
        } catch (\Exception $e) {
            DB::rollback();
            return $this->appResponse(null, null, 422, 'Something went wrong');
        }

    }
}
