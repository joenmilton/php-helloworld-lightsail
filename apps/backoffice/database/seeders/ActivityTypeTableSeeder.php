<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ActivityType;

class ActivityTypeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ActivityType::firstOrCreate(
            ['name' => 'Call'],
            ['icon' => 'uil-phone-alt', 'color' => 'rgb(99, 150, 19)']
        );

        ActivityType::firstOrCreate(
            ['name' => 'Deadline'],
            ['icon' => 'uil-clock-eight', 'color' => 'rgb(174, 10, 37)']
        );

        ActivityType::firstOrCreate(
            ['name' => 'Email'],
            ['icon' => 'uil-postcard', 'color' => 'rgb(12, 32, 213)']
        );

        ActivityType::firstOrCreate(
            ['name' => 'Meeting'],
            ['icon' => 'uil-users-alt', 'color' => 'rgb(60, 69, 83)']
        );

        ActivityType::firstOrCreate(
            ['name' => 'Task'],
            ['icon' => 'uil-file-alt', 'color' => 'rgb(153, 128, 0)']
        );

        ActivityType::firstOrCreate(
            ['name' => 'Sub Task'],
            ['icon' => 'uil-file-copy-alt', 'color' => 'rgb(153, 128, 0)']
        );
    }
}
