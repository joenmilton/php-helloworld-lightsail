<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use Auth;
use Validator;

class ProductResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->ajax()) {

            $productsQuery = Product::whereNull('deleted_at');
            if ($request->has('q') && $request->q != '') {
                $productsQuery->where('name', 'like', '%' . $request->q . '%')
                    ->orWhere('sku', $request->q);
            }
            $products = $productsQuery->paginate($request->per_page ?? 25);

            return $this->response($products, '');
        }
    
        return view('admin.product.index');
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
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'description' => 'nullable|string|max:300',
            'unit_price' => 'required|numeric|regex:/^\d+(\.\d{1,3})?$/',
            'direct_cost' => 'nullable|numeric|regex:/^\d+(\.\d{1,3})?$/',
            'unit' => 'nullable|string',
            'tax_rate' => 'nullable|numeric',
            'tax_label' => 'nullable|string',
            'sku' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $product = Product::create([
                'name' => $request->name,
                'description' => $request->has('description') ? $request->description : '',
                'unit_price' => $request->has('unit_price') ? $request->unit_price : 0.00,
                'direct_cost' => ($request->has('direct_cost') && $request->direct_cost != '') ? $request->direct_cost : 0.00,
                'unit' => ($request->has('unit') && $request->unit != '') ? $request->unit : 'no',
                'tax_rate' => ($request->has('tax_rate') && $request->tax_rate != '') ? $request->tax_rate : 0.00,
                'tax_label' => ($request->has('tax_label') && $request->tax_label != '') ? $request->tax_label : 'TAX',
                'sku' => $request->has('sku') ? $request->sku : '',
                'is_active' => ($request->has('is_active') && $request->is_active == true) ? true : false,
                'created_by' => Auth::id()
            ]);

            DB::commit();

            $updatedProducts = Product::whereNull('deleted_at')
                ->paginate($request->per_page ?? 25);

            return $this->response($updatedProducts, '');
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
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'description' => 'nullable|string|max:300',
            'unit_price' => 'required|numeric|regex:/^\d+(\.\d{1,3})?$/',
            'direct_cost' => 'nullable|numeric|regex:/^\d+(\.\d{1,3})?$/',
            'unit' => 'nullable|string',
            'tax_rate' => 'nullable|numeric',
            'tax_label' => 'nullable|string',
            'sku' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $product = Product::where('id', $id)->first();
            if(is_null($product)) {
                return $this->response(null, 'Product not valid', [], 400);
            }

            $product->name              = $request->name;
            $product->description       = $request->has('description') ? $request->description : '';
            $product->unit_price        = $request->has('unit_price') ? $request->unit_price : 0.00;
            $product->direct_cost       = ($request->has('direct_cost') && $request->direct_cost != '') ? $request->direct_cost : 0.00;
            $product->unit              = ($request->has('unit') && $request->unit != '') ? $request->unit : 'no';
            $product->tax_rate          = ($request->has('tax_rate') && $request->tax_rate != '') ? $request->tax_rate : 0.00;
            $product->tax_label         = ($request->has('tax_label') && $request->tax_label != '') ? $request->tax_label : 'TAX';
            $product->sku               = $request->has('sku') ? $request->sku : '';
            $product->is_active         = ($request->has('is_active') && $request->is_active == true) ? true : false;
            $product->save();

            DB::commit();

            $updatedProducts = Product::whereNull('deleted_at')
                ->paginate($request->per_page ?? 25);

            return $this->response($updatedProducts, '');
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
}
