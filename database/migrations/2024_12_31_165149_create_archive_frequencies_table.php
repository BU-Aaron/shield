<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('archive_frequencies', function (Blueprint $table) {
            $table->id();
            $table->integer('years')->default(5);
            $table->boolean('enabled')->default(true);
            $table->timestamps();
        });

        DB::table('archive_frequencies')->insert([
            'years' => 5,
            'enabled' => true,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archive_frequencies');
    }
};
