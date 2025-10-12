<nav class="sticky-nav">
    <div class="custom-accordion">
        <!-- <a class="text-body fw-semibold pb-2 d-block" data-bs-toggle="collapse" href="#categories-collapse" role="button" aria-expanded="false" aria-controls="categories-collapse">
            <i class="mdi mdi-chevron-up accor-down-icon text-primary me-1"></i> Footwear
        </a>
        <div class="collapse" id="categories-collapse">
            <ul class="list-unstyled categories-list mb-0">
                <li><a href="#"><i class="mdi mdi-circle-medium me-1"></i> Formal Shoes</a></li>
            </ul>
        </div> -->
        <a href="{{route('admin.settings.index', ['general'])}}" class="pb-2 d-block fw-medium color-light">
            <i class="bx bx-cog nav-icon me-2"></i>
            General
        </a>
        <a href="{{route('admin.settings.index', ['deals'])}}" class="pb-2 d-block fw-medium color-light">
            <i class="fas fa-ticket-alt nav-icon nav-icon me-2"></i>
            Deals
        </a>
    </div>
</nav>