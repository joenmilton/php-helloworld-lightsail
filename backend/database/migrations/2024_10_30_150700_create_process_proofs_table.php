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
        Schema::create('process_proofs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('processing_id')->nullable();
            $table->dateTime('accepted_date')->nullable()->default(null);
            $table->string('proof_status')->nullable();
            $table->string('copyright_status')->nullable();
            $table->string('final_status')->nullable();
            $table->foreign('processing_id')->references('id')->on('paper_processings')->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('process_proofs');
    }
};
