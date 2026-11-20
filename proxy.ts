import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/types_db";

/**
 * Refreshes the Supabase auth session on every matched request and forwards
 * the refreshed cookies to both the server components and the browser.
 */
export async function proxy(request: NextRequest) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                }
            }
        }
    );

    // Do not run code between createServerClient and getUser().
    await supabase.auth.getUser();

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|mp3)$).*)"
    ]
};
