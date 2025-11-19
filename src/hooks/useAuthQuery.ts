import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { RegisterDTO, LoginDTO } from "@/types/auth";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterDTO) => authService.register(data),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginDTO) => authService.login(data),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
