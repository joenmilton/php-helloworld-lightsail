<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Deal;
use App\Models\Billable;
use App\Models\BillableProduct;
use App\Models\Pipeline;
use App\Models\Filter;
use App\Models\FilterDefault;
use App\Models\VisibilityGroup;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Validator;
use Setting;
use Auth;
use Log;

use App\Sigapps\Filters\Date as DateFilter;
use App\Sigapps\Filters\Text as TextFilter;
use App\Sigapps\Filters\Select as SelectFilter;

use App\Services\NotificationService;
use App\Events\NotificationSent;

class DealResourceController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService) {
        $this->notificationService = $notificationService;
    }

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

    public function getBillable(Request $request, string $id)
    {
        if ($request->ajax()) {

            $billable = $this->getBillableData($id);

            if(is_null($billable)) {
                return $this->response($billable, 'No service added!', [], 400);
            }

            return $this->response($billable, '');
        }
    }

    public function updateBillable(Request $request, string $id) {

        $rules = [
            'id'                        => 'nullable|uuid',
            'tax_type'                  => 'required|in:no_tax,inclusive,exclusive',
            'subtotal'                  => 'required|numeric',
            'total'                     => 'required|numeric',
            'total_tax'                 => 'required|numeric',
            'has_discount'              => 'required|boolean',
            'total_discount'            => 'required|numeric',
            'products'                  => 'sometimes|array',
            'products.*.id'             => 'required',
            'products.*.product_id'     => 'required|uuid',
            'products.*.name'           => 'required|string',
            'products.*.description'    => 'nullable|string',
            'products.*.unit_price'     => 'required|numeric',
            'products.*.qty'            => 'required|numeric',
            'products.*.unit'           => 'required|string',
            'products.*.tax_rate'       => 'required|numeric',
            'products.*.tax_label'      => 'required|string',
            'products.*.discount_type'  => 'required|string|in:fixed,percent',
            'products.*.discount_total' => 'required|numeric',
            'products.*.note'           => 'nullable|string',
            'products.*.amount'         => 'required|numeric'
        ];

        $messages = [
            'taxes.required' => 'The taxes field is required',
        ];
        
        $validator = Validator::make($request->all(), $rules, $messages);
        $validator->sometimes('taxes', 'required|array', function ($input, $request) {
            if($request->has('products') && is_array($request->products) && count($request->products) > 0) {
                return in_array($input->tax_type, ['inclusive', 'exclusive']);
            }
            return false;
        });


        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $deal = Deal::where('id', $id)->first();
            if(is_null($deal)) {
                return $this->response(null, 'Deal not valid', [], 400);
            }
            $deal_id = !is_null($deal->parent_id) ? $deal->parent_id : $deal->id;
            $previousTotal = $deal->amount;

            $billable = Billable::updateOrCreate(
                [
                    'billableable_type' => Deal::class, 
                    'billableable_id' => $deal_id,
                ],
                [
                    'billableable_type' => Deal::class, 
                    'billableable_id' => $deal_id,
                    'tax_type' => $request->tax_type,
                ]
            );
            
            BillableProduct::where('billable_id', $billable->id)->delete();

            foreach ($request->products as $productData) {
                $billableProduct = new BillableProduct;

                $billableProduct->billable_id = $billable->id;
                $billableProduct->product_id = $productData['product_id'];
                $billableProduct->name = $productData['name'];
                $billableProduct->description = $productData['description'];
                $billableProduct->unit_price = $productData['unit_price'];
                $billableProduct->qty = $productData['qty'];
                $billableProduct->unit = $productData['unit'];
                $billableProduct->tax_rate = $productData['tax_rate'];
                $billableProduct->tax_label = $productData['tax_label'];
                $billableProduct->discount_type = $productData['discount_type'];
                $billableProduct->discount_total = $productData['discount_total'];
                $billableProduct->note = $productData['note'];
                // $billableProduct->amount = $productData['amount'];
                $billableProduct->save();
            }
            DB::commit();

            $deal = Deal::where('id', $deal_id)->first();
            if(!is_null($deal) && !is_null($deal->billableable)) {
                $deal->billableable->updateAggregates();
            }

            $billableData = $this->getBillableData($deal_id);

            if($previousTotal != $billableData['total']) {
                $billable->logProductChange($billableData);
            }

            return $this->response($billableData, '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }

    }
    
    public function updateOwner(Request $request)
    {
        if ($request->ajax()) {

            $validator = Validator::make($request->all(), [
                'deal_id' => 'nullable|uuid',
                'owner_id' => 'nullable|integer'
            ]);
    
            if ($validator->fails()) { 
                return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
            }

            try {
                DB::beginTransaction();
                $deal = Deal::whereNull('deleted_at')->where('id', $request->deal_id)->first();
                if(is_null($deal)) {
                    return $this->response(null, 'Deal not valid', [], 400);
                }

                $existingUsers = $deal->users->where('id', '!=', $deal->owner_id)->pluck('id')->toArray();

                $deal->owner_id = $request->owner_id;
                $deal->save();

                $assignedIds[$request->owner_id] = ['is_deal_owner' => 1];
                if(count($existingUsers) > 0) {
                    foreach($existingUsers as $usr) {
                        $assignedIds[$usr] = ['is_deal_owner' => 0];
                    }
                }
                $deal->users()->detach();
                $deal->users()->attach($assignedIds);

                $deal->logOwnerChange();
                DB::commit();

                $updatedDeal = $this->retriveDeal($request->deal_id);
                if(!$updatedDeal) {
                    return $this->response(null, 'Deal not valid', [], 400);
                }

                // Create notification for new owner
                $push_notification = $this->notificationService->create([
                    'title' => 'Deal Owner Changed',
                    'message' => "You have been assigned as the owner of deal '{$updatedDeal->name}'",
                    'type' => 'management',
                    'target_type' => 'single',
                    'link' => "/deals/{$updatedDeal->id}",
                    'data' => [
                        'deal_id' => $updatedDeal->id,
                        'action' => 'owner_change'
                    ]
                ], $request->owner_id);
                broadcast(new NotificationSent($push_notification));

                return $this->response($updatedDeal, '');
            } catch (\Exception $e) {
                DB::rollback();
                return $this->response(null, 'Something went wrong', [], 400);
            }
        }
    }

    public function updateJournal(Request $request)
    {
        if ($request->ajax()) {
            try {
                return $this->response([], '');
            } catch (\Exception $e) {
                DB::rollback();
                return $this->response(null, 'Something went wrong', [], 400);
            }
        }
    }

    public function updateContact(Request $request)
    {
        if ($request->ajax()) {

            $validator = Validator::make($request->all(), [
                'deal_id' => 'nullable|uuid',
                'contact_id' => 'nullable|integer'
            ]);
    
            if ($validator->fails()) { 
                return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
            }
            
            $deal = Deal::whereNull('deleted_at')->where('id', $request->deal_id)->first();
            if(is_null($deal)) {
                return $this->response(null, 'Deal not valid', [], 400);
            }

            try {
                DB::beginTransaction();
                $parentDeal = (!is_null($deal->parentDeal) && isset($deal->parentDeal->id)) ? $deal->parentDeal : $deal;
                
                if($parentDeal->contact_id != $request->contact_id) {
                    $parentDeal->internal_reference_id = null;
                }
                
                $parentDeal->contact_id = $request->contact_id;
                $parentDeal->save();
                DB::commit();

                $parentDeal->logContactChange($parentDeal->contact, 'contact_attach');

                $updatedDeal = $this->retriveDeal($request->deal_id);
                if(!$updatedDeal) {
                    return $this->response(null, 'Deal not valid', [], 400);
                }

                return $this->response($updatedDeal, '');
            } catch (\Exception $e) {
                DB::rollback();
                return $this->response(null, 'Something went wrong', [], 400);
            }
        }
    }

    public function updateStage(Request $request)
    {
        if ($request->ajax()) {

            $validator = Validator::make($request->all(), [
                'deal_id' => 'nullable|uuid',
                'stage_id' => 'nullable|uuid'
            ]);
    
            if ($validator->fails()) { 
                return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
            }

            try {
                DB::beginTransaction();
                $deal = Deal::whereNull('deleted_at')->where('id', $request->deal_id)->first();
                if(is_null($deal)) {
                    return $this->response(null, 'Deal not valid', [], 400);
                }

                $originalStage = $deal->stage;
                $deal->stage_id = $request->stage_id;
                $deal->save();
                DB::commit();
                
                $updatedDeal = $this->retriveDeal($request->deal_id);
                if(!$updatedDeal) {
                    return $this->response(null, 'Deal not valid', [], 400);
                }

                $updatedDeal->logStageChange($originalStage);
                return $this->response($updatedDeal, '');
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

            $query = Deal::getVisibleDeals()
                ->applyFilter($request->all(), 'deals')
                ->applySort($request->all(), 'deals');

            // Execute the paginated query
            $deals = $query->select('deals.*')
                ->with([
                    'parentDeal' => function($query) {
                        $query->with(['pipeline' => function($q) {
                            $q->select('id', 'name');
                        }])->select('id', 'amount', 'contact_id', 'pipeline_id', 'name');
                    },
                    'pipeline' => function($query) {
                        $query->select('id', 'name');
                    },
                    'stage' => function($query) {
                        $query->select('id', 'name');
                    },
                    'owner' => function($query) {
                        $query->select('id', 'name');
                    },
                    'contact' => function($query) {
                        $query->select('id', 'name', 'email', 'country_code', 'mobile');
                        $query->with(['customFields' => function($query) {
                            $query->select('field_name', 'field_value', 'model_type', 'model_id')
                                ->whereNull('deleted_at');
                        }]);
                        $query->whereNull('deleted_at');
                    },
                ])
                // ->with('customFields:field_name,field_value,model_type,model_id')
                ->paginate($request->per_page);
            
  
            // $response = [
            //     'summary' => $summary,
            //     'deals' => $deals
            // ];

            return $this->response($deals, '');
        }
    
        return view('admin.deals.index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.deals.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'pipeline_id' => 'required|string|uuid',
            'stage_id' => 'required|string|uuid',
            'expected_close_date' => 'nullable|date_format:Y-m-d\TH:i:s.v\Z',
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $expectedCloseDate = $request->has('expected_close_date') ? 
                Carbon::parse($request->expected_close_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : 
                Carbon::tomorrow()->endOfMonth()->endOfDay()->format('Y-m-d H:i:s');

            $deal = Deal::create([
                'id' => Str::uuid(),
                'name' => $request->name,
                'owner_id' => Auth::id(),
                'pipeline_id' => $request->pipeline_id,
                'stage_id' => $request->stage_id,
                'amount' => $request->amount,
                'expected_close_date' => $expectedCloseDate
            ]);

            //Create Client task if not exist
            $deal->createClientTask();

            $assignedIds[Auth::id()] = ['is_deal_owner' => 1];
            $deal->users()->attach($assignedIds);

            $settings = Setting::get('custom_fields', []);
            if(isset($settings['deal']) && count($settings['deal']) > 0) {
                foreach($settings['deal'] as $customField) {
    
                    if(isset($customField['name'])) {
                        $name = $customField['name'];
                        $filteredFields = array_filter($request->temp_custom_fields, function ($field) use ($name) {
                            return $field['field_name'] === $name;
                        });
                        $field = reset($filteredFields);
        
                        $deal->customFields()->updateOrCreate(
                            [ 'field_name' => $name ],
                            [
                                'field_value' => $field['field_value'] ?? '',
                            ]
                        );
                    }
                }
            }

            DB::commit();

            return $this->response($deal, '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        if ($request->ajax()) {
            // broadcast(new NotificationSent('tttttt'))->toOthers();

            $deal = $this->retriveDeal($id);
            if(!$deal) {
                return $this->response(null, 'Deal not valid', [], 400);
            }

            return $this->response($deal, '');
        }

        return view('admin.deals.view');
    }


    private function retriveDeal($deal_id) {
        $deal = Deal::with([
            'parentDeal' => function($query) {
                $query->with(['pipeline' => function($query) {
                    $query->select('id', 'name');
                }])->with(['owner' => function($query) {
                    $query->select('id', 'name');
                }])->with(['childDeals' => function($query) {
                    $query->with(['owner' => function($query) {
                        $query->select('id', 'name');
                    }])
                    ->with(['pipeline' => function($query) {
                        $query->select('id', 'name');
                    }])
                    ->select('id', 'parent_id', 'pipeline_id', 'owner_id')
                        ->whereNull('deleted_at');
                }])
                ->select('*')
                ->whereNull('deleted_at');
            },
            'childDeals' => function($query) {
                $query->with(['pipeline' => function($query) {
                    $query->select('id', 'name');
                }])->with(['owner' => function($query) {
                    $query->select('id', 'name');
                }])
                ->select('id', 'parent_id', 'pipeline_id', 'owner_id')
                ->whereNull('deleted_at');
            },
            'pipeline' => function($query) {
                $query->with(['stages' => function($query) {
                    $query->whereNull('deleted_at')
                          ->orderBy('sort_order', 'ASC');
                }])
                ->whereNull('deleted_at');
            },
            'stage' => function($query) {
                $query->whereNull('deleted_at');
            },
            'contact' => function($query) {
                $query->select('id', 'name', 'email', 'country_code', 'mobile');
                $query->with(['customFields' => function($query) {
                    $query->select('field_name', 'field_value', 'model_type', 'model_id')
                        ->whereNull('deleted_at');
                }]);
                $query->whereNull('deleted_at');
            },
            'contact.internal_references' => function($query) {
                $query->select('id', 'contact_id', 'name');
            },
            'users' => function($query) {
                $query->select('id', 'name');
            },
            'internal_reference' => function($query) {
                $query->select('id', 'name');
            }
        ])
        ->with('customFields:field_name,field_value,model_type,model_id')
        ->where('id', $deal_id)
        ->whereNull('deleted_at')
        ->first();

        if(is_null($deal)) {
            return false;
        }

        // Override customFields and tempCustomFields with parent's customFields if parentDeal exists
        $deal->customFields = ($deal->parentDeal && $deal->parentDeal?->id) ? $deal->parentDeal->customFields : $deal->customFields;
        $deal->tempCustomFields = ($deal->parentDeal && $deal->parentDeal?->id) ? $deal->parentDeal->customFields : $deal->customFields; // Adjust this if tempCustomFields has different logic

        // Update progress_type for pipeline stages
        if ($deal && $deal->pipeline && $deal->stage) {
            $presentStageId = $deal->stage_id;
        
            $deal->pipeline->stages->map(function($stage) use ($presentStageId, $deal) {
                if ($stage->id == $presentStageId) {
                    $stage->progress_type = 'present';
                } else if ($stage->sort_order < $deal->stage->sort_order) {
                    $stage->progress_type = 'past';
                } else {
                    $stage->progress_type = 'future';
                }
        
                return $stage;
            });
        }

        return $deal;
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return view('admin.deals.view');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $rule = [];
        if($request->has('name') && $request->name != '') {
            $rule['name'] = 'nullable|string|max:255';
        }

        if((!$request->has('id') || $request->id == '') && $request->has('expected_close_date') && $request->expected_close_date != '') {
            $rule['expected_close_date'] = 'nullable|date_format:Y-m-d\TH:i:s.v\Z';
        }

        $validator = Validator::make($request->all(), $rule);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $deal = Deal::where('id', $id)->first();
            if(is_null($deal)) {
                return $this->response(null, 'Deal not valid', [], 400);
            }

            $parentDeal = (!is_null($deal->parentDeal) && isset($deal->parentDeal->id)) ? $deal->parentDeal : $deal;
            
            if(!is_null($request->name) && $request->name != '') {
                $deal->name = $request->name;
            }

            if(!is_null($request->expected_close_date) && $request->expected_close_date != '') {
                $expectedCloseDate = $request->has('expected_close_date') ? 
                    Carbon::parse($request->expected_close_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : 
                    Carbon::tomorrow()->endOfMonth()->endOfDay()->format('Y-m-d H:i:s');
                $deal->expected_close_date = $expectedCloseDate;
            }

            if(!is_null($request->internal_reference_id) && $request->internal_reference_id != '') {
                $parentDeal->internal_reference_id = $request->internal_reference_id == '-' ? null : $request->internal_reference_id;
            }

            // Collect new user IDs
            $newUserIds = [];
            if(!is_null($request->users) && is_array($request->users)) {

                $owner_id = $deal->owner_id;
                $assignedIds[$owner_id] = ['is_deal_owner' => 1];

                // Get existing assigned user IDs
                $existingUserIds = $deal->users()->pluck('users.id')->toArray();

                if(count($request->users) > 0) {
                    foreach($request->users as $user) {
                        if (isset($user['id'])) {
                            $id = $user['id'];
                            $assignedIds[$id] = ['is_deal_owner' => ($id === $owner_id ? 1 : 0)];
            
                            // Check if this is a newly assigned user
                            if (!in_array($id, $existingUserIds)) {
                                $newUserIds[] = $id;
                            }
                        }
                    }
                }
                $deal->users()->detach();
                $deal->users()->attach($assignedIds);
            }
            $deal->save();

            if($request->has('temp_custom_fields') && !is_null($request->temp_custom_fields)) {
                $settings = Setting::get('custom_fields', []);
                if(isset($settings['deal']) && count($settings['deal']) > 0) {
                    foreach($settings['deal'] as $customField) {
        
                        if(isset($customField['name'])) {
                            $name = $customField['name'];
                            $filteredFields = array_filter($request->temp_custom_fields, function ($field) use ($name) {
                                return $field['field_name'] === $name;
                            });
                            $field = reset($filteredFields);
            
                            $parentDeal->customFields()->updateOrCreate(
                                [ 'field_name' => $name ],
                                [
                                    'field_value' => $field['field_value'] ?? '',
                                ]
                            );
                        }
                    }
                }
            }
            DB::commit();

            $updatedDeal = $this->retriveDeal($deal->id);
            if(!$updatedDeal) {
                return $this->response(null, 'Deal not valid', [], 400);
            }

            if(count($newUserIds) > 0) {
                // Create notification to assigned users
                $push_notification = $this->notificationService->create([
                    'title' => 'Deal Shared with You',
                    'message' => "You have been added as a participant in the deal '{$updatedDeal->name}'",
                    'type' => 'management',
                    'target_type' => 'group',
                    'link' => "/deals/{$updatedDeal->id}",
                    'data' => [
                        'deal_id' => $updatedDeal->id,
                        'action' => 'deal_shared'
                    ]
                ], $newUserIds);
                broadcast(new NotificationSent($push_notification));
            }

            return $this->response($updatedDeal, '');
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

    public function detachContact(Request $request, string $id)
    {
        if ($request->ajax()) {
            try {
                DB::beginTransaction();
                $deal = Deal::whereNull('deleted_at')->where('id', $id)->first();
                if(is_null($deal)) {
                    return $this->response(null, 'Deal not valid', [], 400);
                }
                $parentDeal = (!is_null($deal->parentDeal) && isset($deal->parentDeal->id)) ? $deal->parentDeal : $deal;
                $removedContact = $parentDeal->contact;

                $parentDeal->contact_id = null;
                $parentDeal->internal_reference_id = null;
                $parentDeal->save();
                DB::commit();
                
                $parentDeal->logContactChange($removedContact, 'contact_detach');
                $updatedDeal = $this->retriveDeal($id);
                if(!$updatedDeal) {
                    return $this->response(null, 'Deal not valid', [], 400);
                }

                return $this->response($updatedDeal, '');
            } catch (\Exception $e) {
                DB::rollback();
                return $this->response(null, 'Something went wrong', [], 400);
            }
        }
    }


    public function updateStatus(Request $request) {
        if ($request->ajax()) {

            $validator = Validator::make($request->all(), [
                'deal_id' => 'nullable|uuid',
                'status' => 'nullable|in:1,2,3'
            ]);
    
            if ($validator->fails()) { 
                return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
            }
            
            DB::beginTransaction();
            try {
                $deal = Deal::whereNull('deleted_at')->where('id', $request->deal_id)->first();
                if(is_null($deal)) {
                    return $this->response(null, 'Deal not valid', [], 400);
                }

                //update owner_rewarded_at if deal is won and owner_rewarded_at is null and some other conditions
                if(is_null($deal->parent_id) && 
                    !is_null($deal->contact_id) && 
                    is_null($deal->owner_rewarded_at) && 
                    $request->status == 2) {

                    $internal_reference_id = $deal->internal_reference_id;
                    $contact_id = $deal->contact_id;
                    $rewarded = Deal::where('contact_id', $contact_id)
                        ->where(function($query) use ($internal_reference_id) {
                            if(is_null($internal_reference_id)) {
                                $query->whereNull('internal_reference_id');
                            } else {
                                $query->where('internal_reference_id', $internal_reference_id);
                            }
                        })
                        ->whereNotNull('owner_rewarded_at')
                        ->first();

                    if(is_null($rewarded)) {
                        $deal->owner_rewarded_at = Carbon::now();
                        $deal->save();
                    }
                }

                $deal->updateStatus($request->status, $request->lost_reason);
                DB::commit();

                $deal->logStatusChange('status_change');

                $updatedDeal = $this->retriveDeal($request->deal_id);
                if(!$updatedDeal) {
                    return $this->response(null, 'Deal not valid', [], 400);
                }

                return $this->response($updatedDeal, '');
            } catch (\Exception $e) {
                DB::rollback();
                return $this->response(null, 'Something went wrong', [], 400);
            }
        }
    }
    
    public function getClonePipelines(Request $request, string $id) {
        if ($request->ajax()) {

            try {
                $deal = Deal::with('parentDeal.childDeals')->where('id', $id)->first();

                if(is_null($deal->parent_id) || (!is_null($deal->parentDeal) && !isset($deal->parentDeal->id)) ) {
                    $pipelines      = $deal->childDeals->pluck('pipeline_id')->toArray();
                    $allPipelines   = array_merge($pipelines, [$deal->pipeline_id]);
                } else {
                    $pipelines      = $deal->parentDeal->childDeals->pluck('pipeline_id')->toArray();
                    $allPipelines   = array_merge($pipelines, [$deal->parentDeal->pipeline_id]);
                }

                $allPipelinesQuoted = implode(',', array_map(function ($id) {
                    return "'" . $id . "'";
                }, $allPipelines));

                $available_pipelines = Pipeline::select('pipelines.id', 'pipelines.name')
                    ->leftJoin(DB::raw("(SELECT id, 1 as `exists` FROM pipelines WHERE id IN ($allPipelinesQuoted)) as pip"), 'pip.id', '=', 'pipelines.id')
                    ->selectRaw('IF(pip.id IS NULL, 0, 1) as `exists`')
                    ->whereNull('pipelines.deleted_at')
                    ->orderBy('exists', 'desc')
                    ->get();

                return $this->response($available_pipelines, '');
            } catch (\Exception $e) {
                DB::rollback();
                return $this->response(null, 'Something went wrong', [], 400);
            }
        }
    }
 

    public function getCloneUsers(Request $request, string $id, string $pipeline) {

        $visibilityGroup = VisibilityGroup::where('visibilityable_type', Pipeline::class)
            ->where('visibilityable_id', $pipeline)
            ->first();
        if(is_null($visibilityGroup)) {
            return $this->response(null, 'Pipeline not valid', [], 400);
        }
        
        $users = $visibilityGroup->getVisibleUsers();

        return $this->response($users, '');
    }
    

    public function cloneDeal(Request $request, string $id) {
        if ($request->ajax()) {
            try {
                $deal = Deal::where('id', $id)->first();
                if(is_null($deal)) {
                    return $this->response(null, 'Deal not valid', [], 400);
                }
                
                $pipeline = Pipeline::where('id', $request->pipeline_id)->first();
                if(is_null($pipeline)) {
                    return $this->response(null, 'Pipeline not valid', [], 400);
                }

                $clonedDeal = $deal->clone($request, $pipeline);
                if(!is_null($clonedDeal)) {
                    // clone deal notification
                    $push_notification = $this->notificationService->create([
                        'title' => 'New Deal Assigned to You',
                        'message' => "The deal '{$clonedDeal->name}' has been assigned to you. Please review and take action.",
                        'type' => 'management',
                        'target_type' => 'single',
                        'link' => "/deals/{$clonedDeal->id}",
                        'data' => [
                            'deal_id' => $clonedDeal->id,
                            'action' => 'deal_cloned'
                        ]
                    ], $request->owner_id);
                    broadcast(new NotificationSent($push_notification));
                }

                $deal->logDealClone($pipeline);

                return $this->response(null, '');
            } catch (\Exception $e) {
                return $this->response(null, 'Something went wrong', [], 400);
            }
        }
    }



    private function getDealSettings(Request $request) {
        $data['activeLoader'] = '';
        $data['rules'] = [
            TextFilter::make('deals.name', __('fields.deals.name'))
                ->withoutEmptyOperators()
                ->jsonSerialize(),
            DateFilter::make('deals.created_at', __('fields.deals.created_date'))
                ->jsonSerialize(),
            DateFilter::make('deals.owner_rewarded_at', __('fields.deals.rewarded_date'))
                ->jsonSerialize(),

            DateFilter::make('deals.expected_close_date', __('fields.deals.expected_close_date'))
                ->jsonSerialize(),

            SelectFilter::make('deals.pipeline_id', __('fields.deals.pipeline.name'))
                ->labelKey('name')
                ->valueKey('id')
                ->options(function () {
                    return app(Pipeline::class)
                        ->getVisibles()
                        ->select('pipelines.id', 'pipelines.name')
                        ->get();
                })
                ->jsonSerialize(),
            SelectFilter::make('deals.stage_id', __('fields.deals.stage.name'))
                ->labelKey('name')
                ->valueKey('id')
                ->options(function () {
                    return app(Pipeline::class)
                        ->getVisibles()
                        ->with('stages')
                        ->addSelect('pipelines.*')
                        ->get()
                        ->flatMap(function ($pipeline) {
                            return $pipeline->stages->map(function ($stage) {
                                return [
                                    'id' => $stage->id,
                                    'name' => $stage->name,
                                ];
                            });
                        });
                })
                ->jsonSerialize(),
            SelectFilter::make('deals.owner_id', __('fields.deals.owner.name'))
                ->labelKey('name')
                ->valueKey('id')
                ->options(function () {
                    return app(User::class)->getBackendUsers()
                        ->select(
                            DB::raw("CASE WHEN users.id = " . Auth::id() . " THEN 0 ELSE users.id END as id"),
                            DB::raw("CASE WHEN users.id = " . Auth::id() . " THEN 'Me' ELSE users.name END as name")
                        )
                        ->orderByRaw("users.id = " . Auth::id() . " DESC")
                        ->get();
                })
                ->jsonSerialize(),
            SelectFilter::make('deals.status', __('fields.deals.status'))
                ->labelKey('name')
                ->valueKey('id')
                ->options([['id' => 1, 'name' => 'Open'], ['id' => 2, 'name' => 'Won'], ['id' => 3, 'name' => 'Lost']])
                ->jsonSerialize(),
        ];

        $user = Auth::user();
        $data['filters']           = Filter::where('identifier', 'deals')
            ->where(function ($q) use ($user) {
                $q->whereNull('user_id')
                    ->orWhere('is_shared', true)
                    ->orWhere('user_id', $user->id);
            })
            ->get();

        $data['deal_users']  = [];
        if($request->has('deal_id') && $request->deal_id != '') {
            $deal = Deal::where('id', $request->deal_id)->first();
            if(!is_null($deal) && !is_null($deal->pipeline_id)) {
                $visibilityGroup = VisibilityGroup::where('visibilityable_type', Pipeline::class)
                    ->where('visibilityable_id', $deal->pipeline_id)
                    ->first();
                if(!is_null($visibilityGroup)) {
                    $data['deal_users'] = $visibilityGroup->getVisibleUsers();
                }
            }
        }

        $user_id                = $user->id;
        $activeView             = Setting::get('activeView');
        $activePipeline         = Setting::get('activePipeline');
        $pipelineData           = $this->getPipelineData($user_id);
        $data['activeView']     = isset($activeView[$user_id]) ? $activeView[$user_id] : 'dealTable';
        return $data + $pipelineData;
    }

    public function getSettings(Request $request) {
        $data = $this->getDealSettings($request);
        return $this->response($data, '');
    }

    public function updateSettings(Request $request) {
        if($request->has('activeView') && $request->activeView != '') {
            $user_id                = Auth::id();
            $activeView             = Setting::get('activeView');

            $activeView[$user_id]   = $request->activeView;

            Setting::set('activeView', $activeView);
            Setting::save();
        }

        if($request->has('pipelineId') && $request->pipelineId != '') {
            $user_id                    = Auth::id();
            $activePipeline             = Setting::get('activePipeline');

            $activePipeline[$user_id]   = $request->pipelineId;

            Setting::set('activePipeline', $activePipeline);
            Setting::save();
        }

        $data = $this->getDealSettings($request);
        return $this->response($data, '');
    }

    private function getPipelineData($user_id) {
        $pipelines = Pipeline::getVisibles()
            ->select('pipelines.id', 'pipelines.name')
            ->get();
        if($pipelines->count() <= 0) {
            $data['activePipeline'] = '';
            $data['pipelines']      = [];
            return $data;
        }

        $activePipeline = Setting::get('activePipeline');
        $activePipeline = isset($activePipeline[$user_id]) ? $activePipeline[$user_id] : '';

        $activePipelineExists = $pipelines->contains('id', $activePipeline);

        if (!$activePipeline || !$activePipelineExists) {
            $activePipeline = $pipelines->first()->id;
        }

        // Add the 'is_active' flag to each pipeline
        $pipelines->transform(function ($pipeline) use ($activePipeline) {
            $pipeline->default = $pipeline->id == $activePipeline;
            return $pipeline;
        });

        $data['activePipeline'] = $activePipeline;
        $data['pipelines'] = $pipelines;

        return $data;
    }
    
}
