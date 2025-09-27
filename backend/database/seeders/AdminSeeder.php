<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'role' => 'admin',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => env('ADMIN_EMAIL', 'admin@example.com'),
            'password' => bcrypt(env('ADMIN_PASSWORD', 'password123')),
            'is_active' => 1,
        ]);
    }
}
