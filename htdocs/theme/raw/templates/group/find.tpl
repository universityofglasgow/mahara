{include file="header.tpl"}
{$form|safe}
{if $groups}
<div class="card card-secondary view-container">
    <h2 class="card-heading">{str tag=Results}</h2>
    <div id="findgroups" class="list-group">
        {$groupresults|safe}
    </div>
</div>
{$pagination|safe}
{if $pagination_js}
<script>
{$pagination_js|safe}
</script>
{/if}
{else}
    <p class="no-results">
        {str tag="nogroupsfound" section="group"}
    </p>
{/if}
{include file="footer.tpl"}