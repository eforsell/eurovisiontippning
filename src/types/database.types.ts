export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      contests: {
        Row: {
          final_order: Json | null
          id: string
          name: string
          qualifiers: Json | null
          start_time: string
          type: string
          year: number
        }
        Insert: {
          final_order?: Json | null
          id: string
          name: string
          qualifiers?: Json | null
          start_time: string
          type: string
          year: number
        }
        Update: {
          final_order?: Json | null
          id?: string
          name?: string
          qualifiers?: Json | null
          start_time?: string
          type?: string
          year?: number
        }
        Relationships: []
      }
      entries: {
        Row: {
          artist: string
          country: string
          id: string
          song_title: string
          start_position: number | null
          starting_contest: string
          year_id: string
          youtube_id: string | null
        }
        Insert: {
          artist: string
          country: string
          id?: string
          song_title: string
          start_position?: number | null
          starting_contest: string
          year_id: string
          youtube_id?: string | null
        }
        Update: {
          artist?: string
          country?: string
          id?: string
          song_title?: string
          start_position?: number | null
          starting_contest?: string
          year_id?: string
          youtube_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entries_year_id_fkey"
            columns: ["year_id"]
            isOneToOne: false
            referencedRelation: "years"
            referencedColumns: ["id"]
          },
        ]
      }
      friends: {
        Row: {
          created_at: string | null
          friend_id: string
          status: Database["public"]["Enums"]["friendship_status"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          friend_id: string
          status?: Database["public"]["Enums"]["friendship_status"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          friend_id?: string
          status?: Database["public"]["Enums"]["friendship_status"]
          user_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          entry_id: string
          id: string
          note: string
          user_id: string
        }
        Insert: {
          entry_id: string
          id?: string
          note: string
          user_id: string
        }
        Update: {
          entry_id?: string
          id?: string
          note?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "entries"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          entry_id: string
          id: string
          is_qualifier: boolean | null
          rank: number | null
          type: Database["public"]["Enums"]["prediction_type"]
          user_id: string
        }
        Insert: {
          entry_id: string
          id?: string
          is_qualifier?: boolean | null
          rank?: number | null
          type: Database["public"]["Enums"]["prediction_type"]
          user_id: string
        }
        Update: {
          entry_id?: string
          id?: string
          is_qualifier?: boolean | null
          rank?: number | null
          type?: Database["public"]["Enums"]["prediction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "predictions_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "entries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          email: string
          id: string
          is_admin: boolean
          is_private: boolean
          name: string | null
        }
        Insert: {
          email: string
          id: string
          is_admin?: boolean
          is_private?: boolean
          name?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_admin?: boolean
          is_private?: boolean
          name?: string | null
        }
        Relationships: []
      }
      results: {
        Row: {
          entry_id: string
          final_rank: number | null
          is_semi1_qualifier: boolean | null
          is_semi2_qualifier: boolean | null
          year_id: string
        }
        Insert: {
          entry_id: string
          final_rank?: number | null
          is_semi1_qualifier?: boolean | null
          is_semi2_qualifier?: boolean | null
          year_id: string
        }
        Update: {
          entry_id?: string
          final_rank?: number | null
          is_semi1_qualifier?: boolean | null
          is_semi2_qualifier?: boolean | null
          year_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "results_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_year_id_fkey"
            columns: ["year_id"]
            isOneToOne: false
            referencedRelation: "years"
            referencedColumns: ["id"]
          },
        ]
      }
      years: {
        Row: {
          betting_started: boolean
          final_start: string
          id: string
          location: string
          logo_url: string | null
          primary_color: string
          secondary_color: string
          semi1_completed: boolean
          semi1_progression_target: number
          semi1_start: string
          semi2_completed: boolean
          semi2_progression_target: number
          semi2_start: string
          year: number
        }
        Insert: {
          betting_started?: boolean
          final_start: string
          id?: string
          location?: string
          logo_url?: string | null
          primary_color: string
          secondary_color: string
          semi1_completed?: boolean
          semi1_progression_target?: number
          semi1_start: string
          semi2_completed?: boolean
          semi2_progression_target?: number
          semi2_start: string
          year: number
        }
        Update: {
          betting_started?: boolean
          final_start?: string
          id?: string
          location?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          semi1_completed?: boolean
          semi1_progression_target?: number
          semi1_start?: string
          semi2_completed?: boolean
          semi2_progression_target?: number
          semi2_start?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_scores: {
        Args: { target_contest_id: string }
        Returns: boolean
      }
      delete_user_account: { Args: never; Returns: undefined }
      get_friend_leaderboard: {
        Args: { user_uid: string }
        Returns: {
          email: string
          id: string
          name: string
          rank: number
          score: number
        }[]
      }
      get_leaderboard: {
        Args: { p_year_id: string }
        Returns: {
          email: string
          totalpoints: number
          userid: string
        }[]
      }
      get_start_time: {
        Args: {
          p_type: Database["public"]["Enums"]["prediction_type"]
          target_entry_id: string
        }
        Returns: string
      }
      is_accepted_friend: {
        Args: { target_id: string; uid: string }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      search_public_users: {
        Args: { query: string }
        Returns: {
          email: string
          id: string
          name: string
        }[]
      }
    }
    Enums: {
      friendship_status: "pending" | "accepted"
      prediction_type: "semi1" | "semi2" | "final"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      friendship_status: ["pending", "accepted"],
      prediction_type: ["semi1", "semi2", "final"],
    },
  },
} as const

