terraform {
  backend "s3" {
    bucket = "terraform-bucket-2411"
    region = "us-east-1"
    key    = "state/terraform.tfstate"
  }
}
