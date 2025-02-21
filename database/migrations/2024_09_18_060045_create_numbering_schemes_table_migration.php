<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('numbering_schemes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('folder_item_id')->unique();
            $table->string('name');
            $table->string('prefix');
            $table->integer('next_number')->default(1);
            $table->string('reset_frequency');
            $table->date('last_reset_date')->nullable();
            $table->boolean('add_if_approved')->default(false);
            $table->timestamps();

            $table->foreign('folder_item_id')->references('item_id')->on('folders')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('numbering_schemes');
    }
};
