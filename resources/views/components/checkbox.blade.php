<div>
    <label for="{{$getId}}" class="checkbox-label">
        <input type="checkbox" class="simple-box" name="{{$getName}}" id="{{$getId}}" value="{{$getValue}}" {{$checked}}>
        <div class="checkbox"><div class="checkmark"></div></div>
        <span>{{$slot}}</span>
    </label>
</div>