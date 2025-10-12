<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Bank;
use Validator;

class BankResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $teams = Bank::paginate($request->per_page ?? 25);

            return $this->response($teams, '');
        }
    
        return view('admin.settings.banks');
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
            'name' => 'required|string',
            'detail' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }
        
        DB::beginTransaction();
        try {
            $bank = Bank::create([
                'id' => (string) Str::uuid(),
                'name' => $request->name,
                'account_number' => '',
                'detail' => $request->detail,
                'active' => true,
            ]);
            DB::commit();

            $bankList = Bank::paginate();
            return $this->response($bankList, '');

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
            'name' => 'required|string',
            'detail' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }
        
        DB::beginTransaction();
        try {
            $bank = Bank::where('id', $id)->first();
            if(is_null($bank)) {
                return $this->response(null, 'Bank not valid', [], 400);
            }

            $bank->name     = $request->name;
            $bank->detail   = $request->detail;
            $bank->save();

            DB::commit();

            $bankList = Bank::paginate();
            return $this->response($bankList, '');
            
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
                $bank = Bank::where('id', $id)->first();
                if(is_null($bank)) {
                    return $this->response(null, 'Bank account not valid', [], 400);
                }
                $bank->active = $request->status;
                $bank->save();
                DB::commit();

                $updatedBanks = Bank::paginate($request->per_page ?? 25);
                return $this->response($updatedBanks, '');
            } catch (\Exception $e) {
                DB::rollback();
                return $this->response(null, 'Something went wrong', [], 400);
            }
        }
    }
}
