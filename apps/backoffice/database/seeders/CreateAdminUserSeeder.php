<?php
  
namespace Database\Seeders;
  
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CreateAdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $user = User::create([
            'name' => 'Admin', 
            'email' => 'admin@admin.com',
            'guard_name'=>'web',
            'is_superadmin' => true,
            'password' => bcrypt('123456')
        ]);

        $role = Role::create(['name' => 'admin']);
        $permissions = Permission::pluck('id', 'id')->all();
        $role->givePermissionTo($permissions);
        $user->assignRole([$role->id]);


        $user = User::create([
            'name' => 'Franklin', 
            'email' => 'frank@admin.com',
            'guard_name'=>'web',
            'is_superadmin' => false,
            'password' => bcrypt('123456')
        ]);

        $role = Role::where('name', 'admin')->first();
        $permissions = Permission::pluck('id', 'id')->all();
        $role->givePermissionTo($permissions);
        $user->assignRole([$role->id]);



        $user = User::create([
            'name' => 'User', 
            'email' => 'user@admin.com',
            'guard_name'=>'web',
            'password' => bcrypt('123456')
        ]);
    
        $role = Role::create(['name' => 'user']);
     
        // $role->givePermissionTo(['role-list', 'product-list']);

        $user->assignRole([$role->id]);



        
    }
}