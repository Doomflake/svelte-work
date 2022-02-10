<script>

	import Para from "./Paragraph.svelte";
	import Imag from "./image.svelte";


	const contactpara1 = {
		head: 'Get in touch with me!',
		text: "I would love to talk to you and discuss how I can build a site for your needs.  Please fill out the form below and let's create something amazing together!",
	}
	
</script>

<style>
section {
	background: linear-gradient(180deg, #C2D1E8 25%,#2980b9 75%);
}
</style>
<section>
<Para head={contactpara1.head} text={contactpara1.text} />
	<iframe title="contact" src="https://docs.google.com/forms/d/e/1FAIpQLSfKhpWL3FSlvs1bBvO7Ip9JLjAnR6BqhoaQQ_PmSycHEgH1ZA/viewform?embedded=true" width="100%" height="1073" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
</section>