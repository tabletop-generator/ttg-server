# module "iam" {
#   source  = "terraform-aws-modules/iam/aws"
#   version = "5.52.2"
# }

# module "vpc" {
#   source  = "terraform-aws-modules/vpc/aws"
#   version = "5.18.1"
# }

# module "security-group" {
#   source  = "terraform-aws-modules/security-group/aws"
#   version = "5.3.0"
# }

# module "key-pair" {
#   source  = "terraform-aws-modules/key-pair/aws"
#   version = "2.0.3"
# }

# module "ec2-instance" {
#   source  = "terraform-aws-modules/ec2-instance/aws"
#   version = "5.7.1"
# }

# module "rds" {
#   source  = "terraform-aws-modules/rds/aws"
#   version = "6.10.0"
#   # insert the 1 required variable here
#   identifier = "ttg"
# }

resource "cloudflare_r2_bucket" "bucket" {
  account_id = var.cloudflare_account_id
  name = var.cloudflare_bucket_name
}
