<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserPrivilege;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'role' => 'admin',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => env('ADMIN_EMAIL', 'admin@example.com'),
            'password' => Hash::make(env('ADMIN_PASSWORD', 'password123')),
            'is_active' => true,
        ]);

        // Create staff users with varying privileges
        $staff1 = User::create([
            'role' => 'user',
            'first_name' => 'John',
            'last_name' => 'Manager',
            'email' => 'john.manager@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);

        UserPrivilege::create([
            'user_id' => $staff1->id,
            'can_create_product' => true,
            'can_update_product' => true,
            'can_delete_product' => true,
        ]);

        $staff2 = User::create([
            'role' => 'user',
            'first_name' => 'Jane',
            'last_name' => 'Editor',
            'email' => 'jane.editor@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);

        UserPrivilege::create([
            'user_id' => $staff2->id,
            'can_create_product' => true,
            'can_update_product' => true,
            'can_delete_product' => false,
        ]);

        $staff3 = User::create([
            'role' => 'user',
            'first_name' => 'Bob',
            'last_name' => 'Viewer',
            'email' => 'bob.viewer@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);

        UserPrivilege::create([
            'user_id' => $staff3->id,
            'can_create_product' => false,
            'can_update_product' => false,
            'can_delete_product' => false,
        ]);

        // Create demo customer
        $customer = User::create([
            'role' => 'customer',
            'first_name' => 'Alice',
            'last_name' => 'Customer',
            'email' => 'alice.customer@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);

        // Create additional random users
        User::factory()
            ->count(10)
            ->create()
            ->each(function ($user) {
                if ($user->role === 'user') {
                    UserPrivilege::factory()->forUser($user)->create();
                }
            });

        // Create additional customers
        User::factory()
            ->customer()
            ->count(15)
            ->create();
    }
}
