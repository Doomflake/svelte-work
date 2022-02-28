<script>
	import LogRocket from 'logrocket';
LogRocket.init('xz0riz/svelte_profile_dev');
	import Button from './Button.svelte';
	import Cart from "./Cart.svelte";
	import Navbutton from "./Navbutton.svelte";
	import Para from "./Paragraph.svelte";
	import Imag from "./image.svelte";
	import Homepage from "./Homepage.svelte";
	import Example from "./Examples.svelte";
	import Contact from "./Contact.svelte";
	import About from "./About.svelte";
	import {fade} from 'svelte/transition';
	import {fly} from 'svelte/transition';
	import { tweened } from 'svelte/motion';	
	import { cubicOut } from 'svelte/easing';
	const progress = tweened(0, {
		duration: 400,
		easing: cubicOut
	});
	import { createEventDispatcher } from 'svelte';
	let current = 'Frontpage'
	const dispatch = createEventDispatcher();
	let active = false;

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
	x.className = "topnav";
	x.className -= " responsive";
  }
} 
</script>

<style>

	section {
		width: 100%;
		margin: auto;
	}
	div {
    margin: auto;
    width: 100%;
    overflow: hidden;
}	
	footer {
	font-size: .5em;
	text-align: center;
}	
 /* Add a black background color to the top navigation */
.topnav {
  background-color: #333;
  overflow: hidden;
}

/* Style the links inside the navigation bar */
.topnav a {
  float: left;
  display: block;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

/* Change the color of links on hover */
.topnav a:hover {
  background-color: #ddd;
  color: black;
}

/* Add an active class to highlight the current page */
.topnav a.active {
  background-color: #4CAF50;
  color: white;
}

/* Hide the link that should open and close the topnav on small screens */
.topnav .icon {
  display: none;
} 
 /* When the screen is less than 600 pixels wide, hide all links, except for the first one ("Home"). Show the link that contains should open and close the topnav (.icon) */
@media screen and (max-width: 600px) {
  .topnav a:not(:first-child) {display: none;}
  .topnav a.icon {
    float: right;
    display: block;
  }
}

/* The "responsive" class is added to the topnav with JavaScript when the user clicks on the icon. This class makes the topnav look good on small screens (display the links vertically instead of horizontally) */
@media screen and (max-width: 600px) {
  .topnav.responsive {position: relative;}
  .topnav.responsive a.icon {
    position: absolute;
    right: 0;
    top: 0;
  }
  .topnav.responsive a {
    float: none;
    display: block;
    text-align: left;
  }
} 	
button {
  background-color: #4CAF50; /* Green */
  border: .05em solid black;
  color: white;
  padding: .75em;
  text-align: center;
  text-decoration: none;
  display: flex;
  font-size: 2em;
  border-radius: 50%;
  margin: auto;
	}
.front {
	background: linear-gradient(142deg, #C2D1E8 25%,#2980b9 75%);
}
</style>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<section>
<div class="topnav" id="myTopnav">
  <a href="#Frontpage" class="active" on:click="{() => current = 'Frontpage'}">Home</a>
  <a href="#Examples" on:click="{() => current = 'Examples'}">Examples</a>
  <a href="#Contactform" on:click="{() => current = 'Contactform'}" >Contact</a>
  <a href="#Aboutme" on:click="{() => current = 'Aboutme'}">About</a>
  <a href="javascript:void(0);" class="icon" on:click={myFunction}>
    <i class="fa fa-bars"></i>
  </a>
</div>	
	</section>

	<hr>
	<section id='Frontpage' class="front">
	{#if current === 'Frontpage'}
	<div in:fly="{{x:200, duration:3000}}" out:fly="{{x:400, duration:500}}">
		<button on:click="{() => current = 'Contactform'}" >Let's get you a website!</button>
		<Homepage />
	<footer>¹ <a href="https://core.score.org/resources/infographic-5-reasons-your-small-business-needs-website" target="blank">5 Reasons Your Small Business Needs a Website</a></footer>
	</div>
	{/if}
	</section>

<div id='Aboutme'>
{#if current === "Aboutme"}
	<div in:fly="{{y:100, duration:2500}}" out:fly="{{y:400, duration:500}}">
	<About />
	</div>
	{/if}
	
</div>

<div id="contactform">
{#if current === "Contactform"}
	<div in:fly="{{y:-200, duration:2000}}" out:fly="{{y:-200, duration:3000}}">
<Contact />
	</div>
	{/if}
	
</div>

<div id="Examples">
	{#if current === "Examples"}
	<div in:fly="{{x:-200, duration:3000}}" out:fly="{{x:-200, duration:3000}}">
	<Example />
	</div>
	{/if}
</div>
