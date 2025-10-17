<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('papers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('journalable_id');
            $table->string('journalable_type')->nullable();
            $table->bigInteger('owner_id')->unsigned()->nullable();
            $table->uuid('domain_id')->nullable();
            $table->uuid('service_id')->nullable();
            $table->dateTime('confirmation_date')->nullable()->default(null);
            $table->dateTime('deadline')->nullable()->default(null);
            $table->text('paper')->nullable();
            $table->integer('status')->default(1); //1 - open, 2 - owned, 3 - closed
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('owner_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('domain_id')->references('id')->on('master_domains')->onDelete('set null');
            $table->foreign('service_id')->references('id')->on('master_services')->onDelete('set null');
            $table->index(['journalable_id', 'journalable_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('papers');
    }
};
