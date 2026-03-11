# ALB DNS name
output "alb_url" {
  description = "The DNS name of the ALB"
  value       = module.alb.alb_dns_name
}

# Public IPs of EC2 instances
output "ec2_public_ips" {
  description = "Public IP addresses of EC2 instances"
  value       = module.ec2.instance_public_ips
}

# VPC ID
output "vpc_id" {
  description = "The VPC ID created by module"
  value       = module.vpc.vpc_id
}
