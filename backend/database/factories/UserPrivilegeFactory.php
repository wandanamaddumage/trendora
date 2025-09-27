<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserPrivilege;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserPrivilege>
 */
class UserPrivilegeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'can_create_product' => fake()->boolean(70), // 70% chance
            'can_update_product' => fake()->boolean(80), // 80% chance
            'can_delete_product' => fake()->boolean(60), // 60% chance
        ];
    }

    /**
     * Create privileges for a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }

    /**
     * Create full privileges.
     */
    public function fullPrivileges(): static
    {
        return $this->state(fn (array $attributes) => [
            'can_create_product' => true,
            'can_update_product' => true,
            'can_delete_product' => true,
        ]);
    }

    /**
     * Create no privileges.
     */
    public function noPrivileges(): static
    {
        return $this->state(fn (array $attributes) => [
            'can_create_product' => false,
            'can_update_product' => false,
            'can_delete_product' => false,
        ]);
    }
}
