<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\InternalReference;
use Setting;
use Validator;
use Auth;

class ContactResourceController extends Controller
{

    public function getInternalReference(Request $request, string $contact)
    {
        $contactsQuery = InternalReference::where('contact_id', $contact);

        if ($request->has('q') && $request->q != '') {
            $contactsQuery->where('name', 'like', '%' . $request->q . '%');
        }
        $internalReferences = $contactsQuery->paginate($request->per_page ?? 25);

        return $this->response($internalReferences, '');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->ajax()) {

            $contactsQuery = User::getVisibleClients()
                ->select('id', 'name', 'email', 'country_code', 'mobile')
                ->with('customFields:field_name,field_value,model_type,model_id');

            if ($request->has('q') && $request->q != '') {
                $contactsQuery->where('name', 'like', '%' . $request->q . '%')
                    ->orWhere('mobile', $request->q)
                    ->orWhere('email', $request->q);
            }
            $contacts = $contactsQuery->paginate($request->per_page ?? 25);

            return $this->response($contacts, '');
        }
    
        return view('admin.contact.index');
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
            'email' => 'required|email|unique:users,email',
            'mobile' => 'required|unique:users,mobile',
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $contact = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'mobile' => $request->mobile,
                'guard_name' => 'web',
                'source_type' => 'team',
                'is_superadmin' => false,
                'owner_id' => Auth::id(),
                'password' => Hash::make(Str::random(10)),
            ]);

            $role = Role::findByName('user');
            $contact->syncRoles($role);


            $settings = Setting::get('custom_fields', []);
            if(isset($settings['contact']) && count($settings['contact']) > 0) {
                foreach($settings['contact'] as $customField) {

                    if(isset($customField['name'])) {
                        $name = $customField['name'];
                        $filteredFields = array_filter($request->temp_custom_fields, function ($field) use ($name) {
                            return $field['field_name'] === $name;
                        });
                        $field = reset($filteredFields);
        
                        $contact->customFields()->updateOrCreate(
                            [ 'field_name' => $name ],
                            [
                                'field_value' => $field['field_value'] ?? '',
                            ]
                        );
                    }
                }
            }
            
            DB::commit();
            
            $updatedContact = User::select('id', 'name', 'email', 'country_code', 'mobile')
                ->role('user')
                ->with('customFields:field_name,field_value,model_type,model_id')
                ->where('id', $contact->id)
                ->first();

            return $this->response($updatedContact, '');
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
            'email' => 'required|email|unique:users,email,'.$id,
            'mobile' => 'required|unique:users,mobile,'.$id,
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $contact = User::role('user')->where('id', $id)->first();
            if(is_null($contact)) {
                return $this->response(null, 'Contact not valid', [], 400);
            }

            $contact->name              = $request->name;
            $contact->email             = $request->email;
            $contact->mobile            = $request->mobile;
            $contact->guard_name        = 'web';
            $contact->is_superadmin     = false;
            $contact->save();

            $role = Role::findByName('user');
            $contact->syncRoles($role);

            $settings = Setting::get('custom_fields', []);
            if(isset($settings['contact']) && count($settings['contact']) > 0) {
                foreach($settings['contact'] as $customField) {

                    if(isset($customField['name'])) {
                        $name = $customField['name'];
                        $filteredFields = array_filter($request->temp_custom_fields, function ($field) use ($name) {
                            return $field['field_name'] === $name;
                        });
                        $field = reset($filteredFields);
        
                        $contact->customFields()->updateOrCreate(
                            [ 'field_name' => $name ],
                            [
                                'field_value' => $field['field_value'] ?? '',
                            ]
                        );
                    }
                }
            }
            if ($request->has('new_references') && is_array($request->new_references)) {
                // Create new references without deleting existing ones
                foreach ($request->new_references as $reference) {
                    if (!empty(trim($reference))) {
                        $contact->internal_references()->create([
                            'name' => trim($reference),
                            'contact_id' => $contact->id
                        ]);
                    }
                }
            }
            DB::commit();

            $updatedContact = User::select('id', 'name', 'email', 'country_code', 'mobile')
                ->role('user')
                ->with('customFields:field_name,field_value,model_type,model_id')
                ->where('id', $id)
                ->first();

            return $this->response($updatedContact, '');
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
