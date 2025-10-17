@extends('layouts.vertical-master-layout')
@section('title')Mentor Thesis - CRM @endsection
@section('css')
<style>
.breadcrumb-container {
	background: #f1f5f9;
}
.breadcrumb {
	/*centering*/
	display: inline-block;
	overflow: hidden;
	border-radius: 5px !important;
	/*Lets add the numbers for each link using CSS counters. flag is the name of the counter. to be defined using counter-reset in the parent element of the links*/
	counter-reset: flag;
	border: 1px solid #cbd5e1;
	background: #f1f5f9;
}

.breadcrumb a {
	text-decoration: none;
	outline: none;
	display: block;
	float: left;
	font-size: 12px;
	line-height: 45px;
	color: white;
	/*need more margin on the left of links to accomodate the numbers*/
	background: #f1f5f9;
	position: relative;
}

/*since the first link does not have a triangle before it we can reduce the left padding to make it look consistent with other links*/
.breadcrumb a:first-child:before {
	left: 14px;
}
.breadcrumb a:last-child {
	border-radius: 0 5px 5px 0; /*this was to prevent glitches on hover*/
	padding-right: 20px;
}

/*hover/active styles*/

/*adding the arrows for the breadcrumbs using rotated pseudo elements*/
.breadcrumb a:after {
	content: '';
	position: absolute;
	top: 0; 
	right: -18px; /*half of square's length*/
	/*same dimension as the line-height of .breadcrumb a */
    width: 45px;
    height: 45px;
	/*as you see the rotated square takes a larger height. which makes it tough to position it properly. So we are going to scale it down so that the diagonals become equal to the line-height of the link. We scale it to 70.7% because if square's: 
	length = 1; diagonal = (1^2 + 1^2)^0.5 = 1.414 (pythagoras theorem)
	if diagonal required = 1; length = 1/1.414 = 0.707*/
	transform: scale(0.707) rotate(45deg);
	/*we need to prevent the arrows from getting buried under the next link*/
	z-index: 1;
	/*background same as links but the gradient will be rotated to compensate with the transform applied*/
	background: #f1f5f9;
	/*stylish arrow design using box shadow*/

	box-shadow: 
		1px -1px 0 0px #cbd5e1, 
		0px -5px 0 1px rgba(255, 255, 255, 0.1);
}
/*we dont need an arrow after the last link*/
.breadcrumb a:last-child:after {
	content: none;
}

.breadcrumb a span{
	align-items: center;
	font-size: .875rem;
	line-height: 1.25rem;
}
.breadcrumb a span svg{
    width: 1.5rem;
    height: 1.5rem;
}
.breadcrumb a span.breadcrumb-img {
    width: 1.75rem;
    height: 1.75rem;
	border-radius: 50%;
    border: 1px solid #ccc;
	border-width: 2px;
	align-items: center;
	border-radius: 9999px;
}

.flat a, .flat a:after {
	background: #f1f5f9;
	color: #64748b;
	transition: all 0.5s;
}
.flat a:before {
	background: #f1f5f9;
	box-shadow: 0 0 0 1px #ccc;
}
.flat a:hover, .flat a.active, 
.flat a:hover:after, .flat a.active:after{

}
</style>
@endsection
@section('content')


<div class="container">

	<div class="card">
		<div class="card-body">

			<div class="breadcrumb-container">
				<div class="breadcrumb flat">
					<a href="#" class="active">
						<span class="d-flex px-4 py-2">
							<span class="d-flex breadcrumb-img">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="size-6 text-success-500 dark:text-success-400"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
							</span>
							<span class="fw-bold ms-3">Qualified To Buy</span>
						</span>
					</a>
					<a href="#" class="">
						<span class="d-flex px-4 py-2">
							<span class="d-flex breadcrumb-img">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="size-6 text-success-500 dark:text-success-400"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
							</span>
							<span class="fw-bold ms-3">Contact Made</span>
						</span>
					</a>
					<a href="#" class="">
						<span class="d-flex px-4 py-2">
							<span class="d-flex breadcrumb-img">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="size-6 text-success-500 dark:text-success-400"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
							</span>
							<span class="fw-bold ms-3">Presentation Scheduled</span>
						</span>
					</a>
					<a href="#" class="">
						<span class="d-flex px-4 py-2">
							<span class="d-flex breadcrumb-img">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="size-6 text-success-500 dark:text-success-400"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
							</span>
							<span class="fw-bold ms-3">Proposal Made</span>
						</span>
					</a>
					<a href="#" class="">
						<span class="d-flex px-4 py-2">
							<span class="d-flex breadcrumb-img">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="size-6 text-success-500 dark:text-success-400"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
							</span>
							<span class="fw-bold ms-3">Appointment Scheduled</span>
						</span>
					</a>
				</div>
			</div>


		</div>
	</div>


</div>




@endsection

