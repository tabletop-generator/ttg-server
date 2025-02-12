resource "cloudflare_r2_bucket" "bucket" {
  account_id = vars.account_id
  name = vars.name
}
