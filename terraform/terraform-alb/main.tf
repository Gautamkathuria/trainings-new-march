provider "aws" {
  region = "ap-south-1"
}

module "vpc" {
  source        = "./modules/vpc"
  name          = "my-vpc"
  cidr_block    = "10.0.0.0/16"
  public_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  azs           = ["ap-south-1a", "ap-south-1b"]
}

module "ec2" {
  source         = "./modules/ec2"
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.subnet_ids
  instance_count = 2
  instance_type  = "t2.micro"
  ami            = "ami-0f5ee92e2d63afc18" # Amazon Linux 2
  name           = "webserver"
}

module "alb" {
  source       = "./modules/alb"
  subnet_ids   = module.vpc.subnet_ids
  vpc_id       = module.vpc.vpc_id
  sg_ids       = [module.ec2.sg_id]
  instance_ids = module.ec2.instance_ids
  name         = "web-alb"
}


