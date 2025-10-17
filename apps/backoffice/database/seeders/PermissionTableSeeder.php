<?php
  
namespace Database\Seeders;
  
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use Config;

class PermissionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // php artisan db:seed --class=PermissionTableSeeder

        $permissions = Config::get('permission.role_permissions');

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
        
        foreach ($permissions['all'] as $permission) {
            if (!Permission::where('name', $permission)->exists()) {
                Permission::create([
                    'name' => $permission,
                    'guard_name' => 'web'
                ]);
            }
        }
    }
}
