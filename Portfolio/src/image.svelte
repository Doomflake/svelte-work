<script>
    export let link;
    export let alttext;
</script>
<style>
img {
    margin: auto;
    width: 75%;
    max-width: 400px;
    height: 75%;
    max-height: 400px;
    justify-content: center;
    display: block;
}
</style>

<img src={link} alt={alttext} />