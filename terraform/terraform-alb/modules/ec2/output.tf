output "instance_ids" { value = aws_instance.this[*].id }
output "instance_public_ips" { value = aws_instance.this[*].public_ip }
output "sg_id" { value = aws_security_group.this.id }
