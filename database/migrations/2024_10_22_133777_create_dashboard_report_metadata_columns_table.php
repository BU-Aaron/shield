<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('dashboard_report_metadata_columns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('metadata_id')->constrained('metadata')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('dashboard_report_metadata_columns');
    }
};
