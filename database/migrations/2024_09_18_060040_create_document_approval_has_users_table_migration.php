<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('document_approval_has_users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('document_approval_id');
            $table->unsignedBigInteger('user_id');
            $table->string('user_state');
            $table->text('comment')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('document_approval_id')->references('id')->on('document_approvals')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('document_approval_has_users');
    }
};
