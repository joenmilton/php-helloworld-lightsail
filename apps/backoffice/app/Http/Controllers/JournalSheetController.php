<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
class JournalSheetController extends Controller {

    public function getProcessSheet(Request $request) {
        return view('admin.sheet.process');
    }
}