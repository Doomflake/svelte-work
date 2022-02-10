<script>
    export let head;
    export let text;

</script>
<style>
    h2{
        text-align: center;
    }
    p {
        text-align: center;
    }
    
</style>

<h2>
{head}
</h2>

<p>
{text}
<slot />
</p>