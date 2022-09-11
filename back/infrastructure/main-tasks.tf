resource "aws_ecs_task_definition" "task" {
  family                = local.application_name
  requires_compatibilities = [local.launch_type]

  cpu = "256"
  memory = "512"
  network_mode = "awsvpc"
  container_definitions = jsonencode([{
    name = local.application_name
    image = "public.ecr.aws/d4s0x0d4/fargatson:latest"
    cpu = 256
    memory = 512
    essential = true
    portMappings = [{
      containerPort = 80
      hostPort = 80
    }]
  }])
}