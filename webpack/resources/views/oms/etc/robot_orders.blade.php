@extends('adminmanager_standard')

@section('asset-css')
    <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
@endsection

@section('content')
    <script src="{{ asset('/js/oms/oms.app.js') }}"></script>

    {{-- <div class="new-oms-container">
        @include('common.sub_side_nav') --}}
        <div class="main-container">
            @include('oms.etc.robot_orders.head')
            @include('oms.etc.robot_orders.list')
        </div>
    {{-- </div> --}}
@endsection
