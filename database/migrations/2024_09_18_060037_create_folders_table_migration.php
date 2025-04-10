<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('folders', function (Blueprint $table) {
            $table->uuid('item_id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('owned_by');
            $table->string('category')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('item_id')
                ->references('id')
                ->on('items')
                ->onDelete('cascade');

            $table->foreign('owned_by')
                ->references('id')
                ->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('folders');
    }
};
