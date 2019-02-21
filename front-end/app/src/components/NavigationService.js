export default {
    navigate: function(router, searchRequest) {
        router.push({ name: searchRequest.type })
    },
}
