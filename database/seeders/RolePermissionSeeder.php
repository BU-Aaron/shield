<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions
        Permission::create(['name' => 'view workspace']);
        Permission::create(['name' => 'edit workspace']);
        Permission::create(['name' => 'view folder']);
        Permission::create(['name' => 'edit folder']);
        Permission::create(['name' => 'view document']);
        Permission::create(['name' => 'edit document']);

        // Create roles and assign existing permissions
        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        $editor = Role::create(['name' => 'editor']);
        $editor->givePermissionTo([
            'view workspace',
            'edit workspace',
            'view folder',
            'edit folder',
            'view document',
            'edit document',
        ]);

        $viewer = Role::create(['name' => 'viewer']);
        $viewer->givePermissionTo([
            'view workspace',
            'view folder',
            'view document',
        ]);

        $none = Role::create(['name' => 'none']);
    }
}
